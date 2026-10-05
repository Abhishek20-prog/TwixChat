import fs from "fs";
import mongoose from "mongoose";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";
import connectionModel from "../models/connection.js";
import { getAuth, clerkClient } from "@clerk/express";
import { Post } from "../models/post.js";
import { inngest } from "../inngest/index.js";


// ======================================================
// HELPER: GET CURRENT MONGODB USER
// ======================================================

const getCurrentUser = async (req) => {
    const { isAuthenticated, userId } = getAuth(req);

    console.log("Authenticated:", isAuthenticated);
    console.log("Clerk User ID:", userId);

    // Not logged in
    if (!isAuthenticated || !userId) {
        return {
            authenticated: false,
            clerkUserId: null,
            user: null
        };
    }

    // Find existing MongoDB user
    let user = await User.findOne({
        clerkId: userId
    });

    // Create MongoDB user if not found
    if (!user) {
        console.log("MongoDB user not found.");
        console.log("Creating MongoDB user for:", userId);

        const clerkUser = await clerkClient.users.getUser(userId);

        const email =
            clerkUser.emailAddresses?.[0]?.emailAddress || "";

        const username =
            clerkUser.username ||
            email.split("@")[0] ||
            `user_${userId.slice(-8)}`;

        const fullName =
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        const profilePicture =
            clerkUser.imageUrl || "";

        user = await User.create({
            clerkId: userId,
            username,
            email,
            full_name: fullName,
            profile_picture: profilePicture
        });

        console.log("MongoDB user created:", user._id);
    }

    return {
        authenticated: true,
        clerkUserId: userId,
        user
    };
};


// ======================================================
// GET CURRENT USER
// ======================================================

export const getUser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        // Check authentication
        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("getUser error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE CURRENT USER
// ======================================================

// ======================================================
// UPDATE CURRENT USER
// ======================================================

export const updateUser = async (req, res) => {
    try {
        // ======================================================
        // GET CURRENT USER
        // ======================================================

        const { authenticated, user } =
            await getCurrentUser(req);

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in database",
            });
        }

        // ======================================================
        // GET FORM DATA
        // ======================================================

        const {
            username,
            bio,
            location,
            full_name,
            remove_profile_picture,
            remove_cover_photo,
        } = req.body;

        // ======================================================
        // CHECK USERNAME
        // ======================================================

        const newUsername =
            username?.trim() || user.username;

        if (newUsername !== user.username) {
            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: user._id },
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Username already exists",
                });
            }
        }

        // ======================================================
        // DATA TO UPDATE
        // ======================================================

        const updatedData = {
            username: newUsername,

            full_name:
                full_name !== undefined
                    ? full_name.trim()
                    : user.full_name,

            bio:
                bio !== undefined
                    ? bio.trim()
                    : user.bio,

            location:
                location !== undefined
                    ? location.trim()
                    : user.location,
        };

        // ======================================================
        // REMOVE PROFILE PICTURE
        // ======================================================

        if (remove_profile_picture === "true") {
            updatedData.profile_picture = "";
        }

        // ======================================================
        // REMOVE COVER PHOTO
        // ======================================================

        if (remove_cover_photo === "true") {
            updatedData.cover_photo = "";
        }

        // ======================================================
        // CHECK UPLOADED FILES
        // ======================================================

        const profile =
            req.files?.profile?.[0];

        const cover =
            req.files?.cover?.[0];

        console.log(
            "UPDATE USER FILES:",
            req.files
        );

        // ======================================================
        // PROFILE PICTURE UPLOAD
        // ======================================================

        if (profile) {
            console.log(
                "PROFILE FILE:",
                profile.path
            );

            const response =
                await imagekit.files.upload({
                    file: fs.createReadStream(
                        profile.path
                    ),

                    fileName:
                        `${Date.now()}-${profile.originalname}`,

                    folder: "profiles",
                });

            console.log(
                "PROFILE IMAGEKIT RESPONSE:",
                response
            );

            if (!response?.filePath) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Profile image upload failed",
                });
            }

            const url =
                imagekit.helper.buildSrc({
                    urlEndpoint:
                        process.env
                            .IMAGEKIT_URL_ENDPOINT,

                    src: response.filePath,

                    transformation: [
                        {
                            quality: "auto",
                        },
                        {
                            format: "webp",
                        },
                        {
                            width: 512,
                        },
                    ],
                });

            updatedData.profile_picture = url;
        }

        // ======================================================
        // COVER PHOTO UPLOAD
        // ======================================================

        if (cover) {
            console.log(
                "COVER FILE:",
                cover.path
            );

            const response =
                await imagekit.files.upload({
                    file: fs.createReadStream(
                        cover.path
                    ),

                    fileName:
                        `${Date.now()}-${cover.originalname}`,

                    folder: "covers",
                });

            console.log(
                "COVER IMAGEKIT RESPONSE:",
                response
            );

            if (!response?.filePath) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Cover image upload failed",
                });
            }

            const url =
                imagekit.helper.buildSrc({
                    urlEndpoint:
                        process.env
                            .IMAGEKIT_URL_ENDPOINT,

                    src: response.filePath,

                    transformation: [
                        {
                            quality: "auto",
                        },
                        {
                            format: "webp",
                        },
                        {
                            width: 1280,
                        },
                    ],
                });

            updatedData.cover_photo = url;
        }

        // ======================================================
        // UPDATE MONGODB
        // ======================================================

        const updatedUser =
            await User.findByIdAndUpdate(
                user._id,
                {
                    $set: updatedData,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Failed to update user",
            });
        }

        // ======================================================
        // SUCCESS
        // ======================================================

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(
            "UPDATE USER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error?.message ||
                "Internal server error",
        });
    }
};


// ======================================================
// DISCOVER USERS
// ======================================================
export const discoveruser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in database",
            });
        }

        const { input = "" } = req.body;

        const escapedInput = input.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const followingIds = new Set(
            (user.following || []).map((id) =>
                id.toString()
            )
        );

        const users = await User.find({
            _id: {
                $ne: user._id,
            },
            $or: [
                {
                    username: new RegExp(
                        escapedInput,
                        "i"
                    ),
                },
                {
                    email: new RegExp(
                        escapedInput,
                        "i"
                    ),
                },
                {
                    full_name: new RegExp(
                        escapedInput,
                        "i"
                    ),
                },
                {
                    location: new RegExp(
                        escapedInput,
                        "i"
                    ),
                },
            ],
        }).lean();

        const usersWithFollowStatus = users.map(
            (targetUser) => ({
                ...targetUser,

                isFollowing: followingIds.has(
                    targetUser._id.toString()
                ),
            })
        );

        return res.status(200).json({
            success: true,
            users: usersWithFollowStatus,
        });
    } catch (error) {
        console.error("discoveruser error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error",
        });
    }
};



// ======================================================
// FOLLOW USER
// ======================================================

export const followuser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        // Check authentication
        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Check current user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in database"
            });
        }

        const { id } = req.body;

        // Check target ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Cannot follow yourself
        if (user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        // Find target user
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ==================================================
        // CHECK IF ALREADY FOLLOWING
        // ==================================================

        const alreadyFollowing = user.following.some(
            (followingId) =>
                followingId.toString() === id.toString()
        );

        if (alreadyFollowing) {
            return res.status(400).json({
                success: false,
                message: "User already followed"
            });
        }


        // ==================================================
        // ADD TO FOLLOWING
        // ==================================================

        await User.findByIdAndUpdate(
            user._id,
            {
                $addToSet: {
                    following: targetUser._id
                }
            }
        );


        // ==================================================
        // ADD TO FOLLOWERS
        // ==================================================

        await User.findByIdAndUpdate(
            targetUser._id,
            {
                $addToSet: {
                    followers: user._id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "User followed successfully"
        });

    } catch (error) {
        console.error("followuser error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UNFOLLOW USER
// ======================================================

export const unfollowuser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        // Check authentication
        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Check current user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in database"
            });
        }

        const { id } = req.body;

        // Validate target ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Cannot unfollow yourself
        if (user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid operation"
            });
        }

        // Find target user
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ==================================================
        // CHECK IF FOLLOWING
        // ==================================================

        const isFollowing = user.following.some(
            (followingId) =>
                followingId.toString() === id.toString()
        );

        if (!isFollowing) {
            return res.status(400).json({
                success: false,
                message: "User not followed"
            });
        }


        // ==================================================
        // REMOVE FROM FOLLOWING
        // ==================================================

        await User.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    following: targetUser._id
                }
            }
        );


        // ==================================================
        // REMOVE FROM FOLLOWERS
        // ==================================================

        await User.findByIdAndUpdate(
            targetUser._id,
            {
                $pull: {
                    followers: user._id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.error("unfollowuser error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// SEND CONNECTION REQUEST
// ======================================================

export const sendConnectionRequest = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { id: toUserId } = req.body;

        // Check target ID
        if (
            !toUserId ||
            !mongoose.Types.ObjectId.isValid(toUserId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Prevent sending request to yourself
        if (user._id.toString() === toUserId.toString()) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot send a connection request to yourself"
            });
        }

        // Check target user
        const targetUser = await User.findById(toUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ==================================================
        // CHECK WHETHER CONNECTION ALREADY EXISTS
        // ==================================================

        const existingConnection =
            await connectionModel.findOne({
                $or: [
                    {
                        from_user_Id: user._id,
                        to_user_Id: targetUser._id
                    },
                    {
                        from_user_Id: targetUser._id,
                        to_user_Id: user._id
                    }
                ]
            });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message:
                    `Connection already exists with status: ${existingConnection.status}`
            });
        }


        // ==================================================
        // CREATE CONNECTION REQUEST
        // ==================================================

        const newConnection =
            await connectionModel.create({
                from_user_Id: user._id,
                to_user_Id: targetUser._id,
                status: "pending"
            });


        // ==================================================
        // TRIGGER INNGEST EMAIL
        // ==================================================

        await inngest.send({
            name: "app/connection-request",
            data: {
                connectionId: newConnection._id.toString()
            }
        });


        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            data: newConnection
        });

    } catch (error) {
        console.error(
            "sendConnectionRequest error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// GET USER CONNECTIONS
// ======================================================

export const getUserConnections = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Get accepted connections
        const connections =
            await User.findById(user._id)
                .populate("connections");


        // Get pending requests
        const pendingConnections =
            await connectionModel
                .find({
                    to_user_Id: user._id,
                    status: "pending"
                })
                .populate("from_user_Id");


        // Extract users who sent requests
        const pendingUsers =
            pendingConnections.map(
                connection =>
                    connection.from_user_Id
            );


        return res.status(200).json({
            success: true,
            data: {
                connections:
                    connections?.connections || [],

                followers:
                    user.followers || [],

                following:
                    user.following || [],

                pendingConnections:
                    pendingUsers
            }
        });

    } catch (error) {
        console.error(
            "getUserConnections error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// ACCEPT CONNECTION REQUEST
// ======================================================

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { id: fromUserId } = req.body;

        // Validate ID
        if (
            !fromUserId ||
            !mongoose.Types.ObjectId.isValid(fromUserId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }


        // ==================================================
        // FIND PENDING CONNECTION REQUEST
        // ==================================================

        const connection =
            await connectionModel.findOne({
                from_user_Id: fromUserId,
                to_user_Id: user._id,
                status: "pending"
            });

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found"
            });
        }


        // ==================================================
        // FIND REQUESTING USER
        // ==================================================

        const requestingUser =
            await User.findById(fromUserId);

        if (!requestingUser) {
            return res.status(404).json({
                success: false,
                message: "Requesting user not found"
            });
        }


        // ==================================================
        // ADD USERS TO EACH OTHER'S CONNECTIONS
        // ==================================================

        if (
            !user.connections.includes(
                requestingUser._id
            )
        ) {
            user.connections.push(
                requestingUser._id
            );
        }

        if (
            !requestingUser.connections.includes(
                user._id
            )
        ) {
            requestingUser.connections.push(
                user._id
            );
        }


        // ==================================================
        // UPDATE REQUEST STATUS
        // ==================================================

        connection.status = "accepted";


        // ==================================================
        // SAVE ALL CHANGES
        // ==================================================

        await Promise.all([
            user.save(),
            requestingUser.save(),
            connection.save()
        ]);

        return res.status(200).json({
            success: true,
            message:
                "Connection request accepted successfully"
        });

    } catch (error) {
        console.error(
            "acceptConnectionRequest error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// GET USER PROFILE
// ======================================================

export const getUserProfiles = async (req, res) => {
    try {
        const { profileId } = req.params;

        // Validate profile ID
        if (
            !profileId ||
            !mongoose.Types.ObjectId.isValid(profileId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID"
            });
        }


        // ==================================================
        // FIND USER PROFILE
        // ==================================================

        const profile =
            await User.findById(profileId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }


        // ==================================================
        // GET USER POSTS
        // ==================================================

        const posts =
            await Post.find({
                userId: profileId
            })
                .sort({ createdAt: -1 })
                .populate(
                    "userId",
                    "username profile_picture full_name"
                );


        return res.status(200).json({
            success: true,
            profile,
            posts
        });

    } catch (error) {
        console.error(
            "getUserProfiles error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};