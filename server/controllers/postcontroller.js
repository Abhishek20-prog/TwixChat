import fs from "fs";
import { Post } from "../models/post.js";
import imagekit from "../config/imagekit.js";

async function addPost(req, res) {
    try {
        const { content, post_type } = req.body;
        const userId = req.user._id;

        // Get uploaded files safely
        const files = req.files || [];

        // Upload images to ImageKit
        const image_url = await Promise.all(
            files.map(async (image) => {
                try {
                    // Read temporary file
                    const fileBuffer = fs.readFileSync(image.path);

                    // Upload to ImageKit
                    const response = await imagekit.files.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    });

                    // Generate optimized URL
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
                                width: 512,
                            },
                        ],
                    });

                    return url;
                } finally {
                    // Delete temporary multer file
                    if (image.path && fs.existsSync(image.path)) {
                        fs.unlinkSync(image.path);
                    }
                }
            })
        );

        // Create post in MongoDB
        const post = await Post.create({
            user: userId,
            content,
            post_type,
            image_url,
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