import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import {
    addPost,
    getFeedPosts,
    getProfilePosts,
    likePost,
    updatePost,
    deletePost,
} from "../controllers/postcontroller.js";

const postrouter = express.Router();

postrouter.post("/add", protect, upload.array("images", 5), addPost);
postrouter.get("/feed", protect, getFeedPosts);
postrouter.post("/like", protect, likePost);
postrouter.get("/profile/:profileId", protect, getProfilePosts);
postrouter.patch("/:postId", protect, updatePost);
postrouter.delete("/:postId", protect, deletePost);

export default postrouter;