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

            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname
            });

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1280" }
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

            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            });

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "512" }
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
export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;
        const connection  =await connectionModel.findOne({
            $or: [
                { from_user_Id: userId, to_user_Id: id },
                { from_user_Id: id, to_user_Id: userId }
            ]
        });
            

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            data: connection
        });

    } catch (error) {
        console.error("sendConnectionRequest error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}