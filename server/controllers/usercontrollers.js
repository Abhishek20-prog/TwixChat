import fs from "fs";
import mongoose from "mongoose";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";
import connectionModel from "../models/connection.js";
import { getAuth, clerkClient } from "@clerk/express";


// ======================================================
// HELPER: GET CURRENT MONGODB USER
// ======================================================

// ======================================================
// GET CURRENT MONGODB USER
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

    // If user doesn't exist in MongoDB,
    // get the user from Clerk
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

        // Create MongoDB user
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

// ======================================================
// GET CURRENT USER
// ======================================================

export const getUser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

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
// UPDATE USER
// ======================================================

export const updateUser = async (req, res) => {
    try {
        const { authenticated, user } = await getCurrentUser(req);

        // Check Clerk authentication
        if (!authenticated) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Check MongoDB user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in database"
            });
        }

        const {
            username,
            bio,
            location,
            full_name
        } = req.body;


        // ==================================================
        // USERNAME
        // ==================================================

        const newUsername = username || user.username;

        if (newUsername !== user.username) {

            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: user._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }


        // ==================================================
        // UPDATE DATA
        // ==================================================

        const updatedData = {
            username: newUsername,
            bio: bio !== undefined ? bio : user.bio,
            full_name: full_name !== undefined
                ? full_name
                : user.full_name,
            location: location !== undefined
                ? location
                : user.location
        };


        // ==================================================
        // COVER IMAGE
        // ==================================================

        const cover = req.files?.cover?.[0];

      if (cover) {
    const buffer = fs.readFileSync(cover.path);

    const response = await imagekit.files.upload({
        file: buffer,
        fileName: cover.originalname
    });

    const url = imagekit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: response.filePath,
        transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: 1280 }
        ]
    });

    updatedData.cover_photo = url;
}


        // ==================================================
        // PROFILE IMAGE
        // ==================================================

        const profile = req.files?.profile?.[0];

        if (profile) {

            const buffer = fs.readFileSync(profile.path);

            const response = await imagekit.files.upload({
                file: buffer,
                fileName: profile.originalname
            });

            const url = imagekit.helper.buildSrc({
                urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
                src: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: 512 }
                ]
            });

            updatedData.profile_picture = url;
        }


        // ==================================================
        // UPDATE DATABASE
        // ==================================================

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: updatedData
            },
            {
                new: true,
                runValidators: true
            }
        );


        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {

        console.error("updateUser error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// DISCOVER USERS
// ======================================================

export const discoveruser = async (req, res) => {

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

        const { input = "" } = req.body;


        // Escape regex special characters
        const escapedInput = input.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


        const users = await User.find({

            // Don't show current user
            _id: {
                $ne: user._id
            },

            $or: [
                {
                    username: new RegExp(
                        escapedInput,
                        "i"
                    )
                },
                {
                    email: new RegExp(
                        escapedInput,
                        "i"
                    )
                },
                {
                    full_name: new RegExp(
                        escapedInput,
                        "i"
                    )
                },
                {
                    location: new RegExp(
                        escapedInput,
                        "i"
                    )
                }
            ]
        });


        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        console.error("discoveruser error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
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



// ==========================================
// SEND CONNECTION REQUEST
// ==========================================
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
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Prevent sending request to yourself
        if (user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a connection request to yourself"
            });
        }

        // Check if target user exists
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check whether connection already exists
        const existingConnection = await connectionModel.findOne({
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
                message: `Connection already exists with status: ${existingConnection.status}`
            });
        }

        // Create connection request
        const newConnection = await connectionModel.create({
            from_user_Id: user._id,
            to_user_Id: targetUser._id,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            data: newConnection
        });

    } catch (error) {
        console.error("sendConnectionRequest error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ==========================================
// GET USER CONNECTIONS
// ==========================================
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
        const connections = await User.findById(user._id)
            .populate("connections");

        // Get pending requests
        const pendingConnections = await connectionModel
            .find({
                to_user_Id: user._id,
                status: "pending"
            })
            .populate("from_user_Id");

        // Extract users who sent requests
        const pendingUsers = pendingConnections.map(
            connection => connection.from_user_Id
        );

        return res.status(200).json({
            success: true,
            data: {
                connections: connections?.connections || [],
                followers: user.followers || [],
                following: user.following || [],
                pendingConnections: pendingUsers
            }
        });

    } catch (error) {
        console.error("getUserConnections error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ==========================================
// ACCEPT CONNECTION REQUEST
// ==========================================
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
        if (!fromUserId || !mongoose.Types.ObjectId.isValid(fromUserId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Find pending request
        const connection = await connectionModel.findOne({
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

        // Find requesting user
        const requestingUser = await User.findById(fromUserId);

        if (!requestingUser) {
            return res.status(404).json({
                success: false,
                message: "Requesting user not found"
            });
        }

        // Add users to each other's connections
        if (!user.connections.includes(requestingUser._id)) {
            user.connections.push(requestingUser._id);
        }

        if (!requestingUser.connections.includes(user._id)) {
            requestingUser.connections.push(user._id);
        }

        // Update request status
        connection.status = "accepted";

        // Save all changes
        await Promise.all([
            user.save(),
            requestingUser.save(),
            connection.save()
        ]);

        return res.status(200).json({
            success: true,
            message: "Connection request accepted successfully"
        });

    } catch (error) {
        console.error("acceptConnectionRequest error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
//Get user profiles
export const getUserProfiles = async (req, res) => {
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

        // Find all users (excluding the current user)
        const profiles = await User.find({ _id: { $ne: user._id } });

        return res.status(200).json({
            success: true,
            data: profiles
        });

    } catch (error) {
        console.error("getUserProfiles error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
