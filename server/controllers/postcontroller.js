
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Post } from "../models/post.js";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import Comment from "../models/comment.js";
export const addPost = async (req, res) => {
    const files = req.files || [];
    const uploadedPaths = files
        .map((file) => file.path)
        .filter(Boolean);

    try {
        const { content = "" } = req.body;
        const { userId: clerkId } = req.auth();

        if (typeof content !== "string" || content.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Caption must be text and cannot exceed 5000 characters",
            });
        }

        if (files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "You can upload a maximum of 5 files per post",
            });
        }

        const hasImages = files.some((file) =>
            file.mimetype?.startsWith("image/")
        );
        const hasVideos = files.some((file) =>
            file.mimetype?.startsWith("video/")
        );

        if (
            files.some(
                (file) =>
                    !file.mimetype?.startsWith("image/") &&
                    !file.mimetype?.startsWith("video/")
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Only image and video files are supported",
            });
        }

        if (hasImages && hasVideos) {
            return res.status(400).json({
                success: false,
                message: "Upload images and videos in separate posts",
            });
        }

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const image_url = [];
        const video_url = [];

        for (const file of files) {
            const fileSize = file.size;
const sizeMB = fileSize / (1024 * 1024);

            console.log(
                `Uploading ${file.originalname}: ${sizeMB.toFixed(2)} MB`
            );

            if (fileSize > 100 * 1024 * 1024) {
                return res.status(413).json({
                    success: false,
                    message:
                        `${file.originalname} exceeds 100 MB. ` +
                        "This upload route cannot send files larger than 100 MB.",
                });
            }

            const response = await imagekit.files.upload({
                file: createReadStream(file.path),
                fileName: file.originalname,
                folder: "posts",
                useUniqueFileName: true,
            });

            if (file.mimetype.startsWith("video/")) {
                video_url.push(response.url);
            } else {
                const imageUrl = imagekit.helper.buildSrc({
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
                    src: response.filePath,
                    transformation: [
                        { quality: "auto" },
                        { format: "webp" },
                        { width: 1280 },
                    ],
                });

                image_url.push(imageUrl);
            }
        }

        let post_type = "text";

        if (video_url.length) {
            post_type = content.trim() ? "video_text" : "video";
        } else if (image_url.length) {
            post_type = content.trim() ? "image_text" : "image";
        }

        const post = await Post.create({
            userId: user._id,
            content: content.trim(),
            image_url,
            video_url,
            post_type,
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Add Post Error:", {
            message: error.message,
            name: error.name,
            status: error.status,
            statusCode: error.statusCode,
        });

        return res.status(error.status || error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to create post",
        });
    } finally {
        await Promise.all(
            uploadedPaths.map(async (filePath) => {
                try {
                    await fs.unlink(filePath);
                } catch (error) {
                    if (error.code !== "ENOENT") {
                        console.error("Temporary file cleanup failed:", error.message);
                    }
                }
            })
        );
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
      ...new Set(userIds.map((id) => id.toString())),
    ];

    const posts = await Post.find({
      userId: { $in: uniqueUserIds },
    })
      .populate("userId", "username full_name profile_picture")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    const [allComments, previewComments] = await Promise.all([
      postIds.length
        ? Comment.aggregate([
            { $match: { postId: { $in: postIds } } },
            { $group: { _id: "$postId", count: { $sum: 1 } } },
          ])
        : [],
      postIds.length
        ? Comment.find({ postId: { $in: postIds } })
            .sort({ createdAt: -1 })
            .populate("userId", "username full_name profile_picture")
            .lean()
        : [],
    ]);

    const countByPost = new Map(
      allComments.map((item) => [item._id.toString(), item.count])
    );

    const previewsByPost = new Map();

    for (const comment of previewComments) {
      const key = comment.postId.toString();
      const previews = previewsByPost.get(key) || [];

      if (previews.length < 2) {
        previews.push(comment);
        previewsByPost.set(key, previews);
      }
    }

    const formattedPosts = posts.map((post) => ({
      ...post,
      commentsCount: countByPost.get(post._id.toString()) || 0,
      comments: previewsByPost.get(post._id.toString()) || [],
    }));

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Get Feed Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feed posts",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    const { postId } = req.body;

    if (!postId || !mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: "A valid post ID is required",
      });
    }

    const user = await User.findOne({ clerkId }).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObjectId = user._id;

    const post = await Post.findById(postId).select("likes");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userObjectId.toString()
    );

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: userObjectId } }
        : { $addToSet: { likes: userObjectId } },
      { new: true }
    ).select("likes");

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: updatedPost.likes.length,
      message: alreadyLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
    });
  } catch (error) {
    console.error("Like Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
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
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId)
      .populate("userId", "username full_name profile_picture")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const [commentCount, comments] = await Promise.all([
      Comment.countDocuments({ postId: post._id }),
      Comment.find({ postId: post._id })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate("userId", "username full_name profile_picture")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      post: {
        ...post,
        commentsCount: commentCount,
        comments,
      },
    });
  } catch (error) {
    console.error("Get Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};