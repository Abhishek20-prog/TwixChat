import fs from "fs";
import { Post } from "../models/post.js";
import imagekit from "../config/imagekit.js";
import { User } from "../models/user.js";

async function addPost(req, res) {
    try {
        const { content, post_type } = req.body;
        const userId = req.user._id;

        // Uploaded files
        const files = req.files || [];

        // Upload images to ImageKit
        const image_url = await Promise.all(
            files.map(async (image) => {
                try {
                    const fileBuffer = fs.readFileSync(image.path);

                    const response = await imagekit.files.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    });

                    const url = imagekit.helper.buildSrc({
                        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
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

                    return url;
                } finally {
                    // Remove temporary Multer file
                    if (image.path && fs.existsSync(image.path)) {
                        fs.unlinkSync(image.path);
                    }
                }
            })
        );

        // Create post
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
}

export { addPost };
// get all posts
export const getfeedPosts = async (req, res) => {
   try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const userIds = [userId, ...user.following , ...user.followers ,...user.connections]; ;
    const posts = await Post.find({ userId: { $in: userIds } }).populate("userId", "username profile_pic").sort({ createdAt: -1 });
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