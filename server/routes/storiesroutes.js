import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import { addStory, getUserStories } from "../controllers/storycontroller.js";

const storiesRouter = express.Router();

storiesRouter.post("/add", protect, upload.single("file"), addStory);

storiesRouter.get("/feed", protect, getUserStories);

export default storiesRouter;