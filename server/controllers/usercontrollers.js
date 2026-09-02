import fs from "fs";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";


// ================= GET CURRENT USER =================

export const getUser = async (req, res) => {
    try {
        const { userID } = req.auth();

        const user = await User.findById(userID);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ================= UPDATE USER =================

export const updateUser = async (req, res) => {
    try {
        const { userID } = req.auth();

        const {
            username,
            bio,
            location,
            full_name
        } = req.body;

        const currentUser = await User.findById(userID);

        if (!currentUser) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }


        // Check username only if user is trying to change it
        let newUsername = username || currentUser.username;

        if (newUsername !== currentUser.username) {

            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: userID }
            });

            if (existingUser) {
                return res.json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }


        const updatedData = {
            username: newUsername,
            bio,
            full_name,
            location
        };


        // ================= COVER IMAGE =================

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


        // ================= PROFILE IMAGE =================

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


        // ================= UPDATE DATABASE =================

        const user = await User.findByIdAndUpdate(
            userID,
            { $set: updatedData },
            {
                new: true,
                runValidators: true
            }
        );


        return res.json({
            success: true,
            user,
            message: "Profile updated successfully"
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ================= DISCOVER USERS =================

export const discoveruser = async (req, res) => {
    try {

        const { userID } = req.auth();
        const { input = "" } = req.body;

        const users = await User.find({
            _id: { $ne: userID },

            $or: [
                { username: new RegExp(input, "i") },
                { email: new RegExp(input, "i") },
                { full_name: new RegExp(input, "i") },
                { location: new RegExp(input, "i") }
            ]
        });

        return res.json({
            success: true,
            users
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ================= FOLLOW USER =================

export const followuser = async (req, res) => {
    try {

        const { userID } = req.auth();
        const { id } = req.body;

        if (userID === id) {
            return res.json({
                success: false,
                message: "You cannot follow yourself"
            });
        }


        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }


        // Atomic update prevents duplicate follows
        const user = await User.findOneAndUpdate(
            {
                _id: userID,
                following: { $ne: id }
            },
            {
                $addToSet: { following: id }
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.json({
                success: false,
                message: "User already followed"
            });
        }


        await User.findByIdAndUpdate(
            id,
            {
                $addToSet: { followers: userID }
            }
        );


        return res.json({
            success: true,
            message: "User followed successfully"
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ================= UNFOLLOW USER =================

export const unfollowuser = async (req, res) => {
    try {

        const { userID } = req.auth();
        const { id } = req.body;


        const user = await User.findOneAndUpdate(
            {
                _id: userID,
                following: id
            },
            {
                $pull: {
                    following: id
                }
            },
            {
                new: true
            }
        );


        if (!user) {
            return res.json({
                success: false,
                message: "User not followed"
            });
        }


        await User.findByIdAndUpdate(
            id,
            {
                $pull: {
                    followers: userID
                }
            }
        );


        return res.json({
            success: true,
            message: "User unfollowed successfully"
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};