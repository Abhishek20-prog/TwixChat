import fs from "fs/promises";
import { Post } from "../models/post.js";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const addPost = async (req, res) => {
    try {
        const { content = "", post_type } = req.body;
        const { userId: clerkId } = req.auth();
        const files = req.files || [];
        console.log("Files:", files);

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const image_url = await Promise.all(
            files.map(async (image) => {
                try {
                    const fileBuffer = await fs.readFile(image.path);

const response = await imagekit.files.upload({
    file: fileBuffer.toString("base64"),
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
            userId: user._id,
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
        const { userId: clerkId } = req.auth();

        const user = await User.findOne({ clerkId })
            .select("following followers")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userIds = [
            user._id,
            ...(user.following || []),
            ...(user.followers || []),
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
        const { userId: clerkId } = req.auth();
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
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
            id => id.toString() === user._id.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== user._id.toString()
            );

            await post.save();

            return res.status(200).json({
                success: true,
                liked: false,
                message: "Post unliked successfully",
            });
        }

        post.likes.push(user._id);
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
export const updatePost = async (req, res) => {
    try {
        const { userId: clerkId } = req.auth();
        const { postId } = req.params;
        const { content } = req.body;

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Caption cannot be empty",
            });
        }

        const user = await User.findOne({ clerkId }).select("_id");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const post = await Post.findOneAndUpdate(
            {
                _id: postId,
                userId: user._id,
            },
            {
                $set: { content: content.trim() },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you do not own this post",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        console.error("Update Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update post",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { userId: clerkId } = req.auth();
        const { postId } = req.params;

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const user = await User.findOne({ clerkId }).select("_id");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const post = await Post.findOneAndDelete({
            _id: postId,
            userId: user._id,
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you do not own this post",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            postId: post._id,
        });
    } catch (error) {
        console.error("Delete Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
        });
    }
};

export const getProfilePosts = async (req, res) => {
    try {
        const { profileId } = req.params;

        if (!mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }

        const user = await User.findById(profileId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const posts = await Post.find({ userId: user._id })
            .populate("userId", "username full_name profile_picture")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        console.error("Get profile posts error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch profile posts",
        });
    }
};
