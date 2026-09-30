
import fs from "fs/promises";
import { Post } from "../models/post.js";
import imagekit from "../config/imagekit.js";
import { User } from "../models/user.js";

export const addPost = async (req, res) => {
    try {
        const { content , post_type } = req.body;
        const userId = req.user._id;
        const files = req.files || [];

        const image_url = await Promise.all(
            files.map(async (image) => {
                try {
                    const fileBuffer = await fs.readFile(image.path);

                    const response = await imagekit.files.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    });

                    return imagekit.helper.buildSrc({
                        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
                        src: response.filePath,
                        transformation: [
                            { quality: "auto" },
                            { format: "webp" },
                            { width: 1280 },
                        ],
                    });
                } finally {
                    try {
                        await fs.unlink(image.path);
                    } catch (error) {
                        console.error(
                            "Temporary file deletion failed:",
                            error.message
                        );
                    }
                }
            })
        );

        const post = await Post.create({
            userId,
            content,
            image_url,
            post_type,
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Add Post Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth();

        const user = await User.findById(userId)
            .select("following followers connections")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userIds = [
            userId,
            ...(user.following || []),
            ...(user.followers || []),
            ...(user.connections || []),
        ];

        const uniqueUserIds = [
            ...new Set(userIds.map(id => id.toString())),
        ];

        const posts = await Post.find({
            userId: { $in: uniqueUserIds },
        })
            .populate("userId", "username profile_picture")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        console.error("Get Feed Posts Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== userId.toString()
            );

            await post.save();

            return res.status(200).json({
                success: true,
                liked: false,
                message: "Post unliked successfully",
            });
        }

        post.likes.push(userId);
        await post.save();

        return res.status(200).json({
            success: true,
            liked: true,
            message: "Post liked successfully",
        });
    } catch (error) {
        console.error("Like Post Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

