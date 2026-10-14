
import mongoose from "mongoose";
import Comment from "../models/comment.js";
import { Post } from "../models/post.js";
import User from "../models/user.js";

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const postExists = await Post.exists({ _id: postId });

        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comments = await Comment.find({ postId })
            .populate("userId", "username full_name profile_picture")
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            comments,
            count: comments.length,
        });
    } catch (error) {
        console.error("Get Post Comments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
        });
    }
};

export const addComment = async (req, res) => {
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
                message: "Comment cannot be empty",
            });
        }

        if (content.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 2000 characters",
            });
        }

        const user = await User.findOne({ clerkId }).select("_id");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const post = await Post.findById(postId).select("_id comments");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comment = await Comment.create({
            postId: post._id,
            userId: user._id,
            content: content.trim(),
        });

        post.comments.push(comment._id);
        await post.save();

        await comment.populate(
            "userId",
            "username full_name profile_picture"
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment,
            count: post.comments.length,
        });
    } catch (error) {
        console.error("Add Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { userId: clerkId } = req.auth();
        const { commentId } = req.params;

        if (!mongoose.isValidObjectId(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID",
            });
        }

        const user = await User.findOne({ clerkId }).select("_id");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const comment = await Comment.findOneAndDelete({
            _id: commentId,
            userId: user._id,
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or you do not own this comment",
            });
        }

        await Post.updateOne(
            { _id: comment.postId },
            { $pull: { comments: comment._id } }
        );

        const count = await Comment.countDocuments({
            postId: comment.postId,
        });

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            commentId: comment._id,
            postId: comment.postId,
            count,
        });
    } catch (error) {
        console.error("Delete Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete comment",
        });
    }
};
