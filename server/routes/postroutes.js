import express from "express";
import { protect } from "../middleware/auth.js";
import {upload} from "../middleware/multer.js";
import {addPost,getFeedPosts,likePost} from "../controllers/postcontroller.js";
const postrouter = express.Router();
postrouter.post("/add", upload.array("images", 5),protect, addPost);
postrouter.get("/feed",protect, getFeedPosts);
postrouter.post('/like', protect, likePost);
export default postrouter;