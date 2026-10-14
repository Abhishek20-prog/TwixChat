
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
      getPostById,
} from "../controllers/postcontroller.js";

import {
    getPostComments,
    addComment,
    deleteComment,
} from "../controllers/commentcontroller.js";

const postrouter = express.Router();

postrouter.post(
    "/add",
    protect,
    upload.array("images", 5),
    addPost
);

postrouter.post("/add", protect, upload.array("images", 5), addPost);
postrouter.get("/feed", protect, getFeedPosts);
postrouter.post("/like", protect, likePost);

postrouter.get("/:postId/comments", protect, getPostComments);
postrouter.post("/:postId/comments", protect, addComment);
postrouter.delete("/comments/:commentId", protect, deleteComment);

postrouter.get("/profile/:profileId", protect, getProfilePosts);
postrouter.get("/:postId", protect, getPostById);
postrouter.patch("/:postId", protect, updatePost);
postrouter.delete("/:postId", protect, deletePost);

export default postrouter;
