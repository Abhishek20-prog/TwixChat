import ImageKit from "@imagekit/nodejs";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Story } from "../models/story.js";
import User from "../models/user.js";
import { inngest } from "../inngest/index.js";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const addStory = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    const { content, story_type, background_color } = req.body;
    const file = req.file;

    const user = await User.findOne({ clerkId }).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let media_url = [];

    if (story_type === "image" || story_type === "video") {
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Media file is required",
        });
      }

      try {
        const response = await imagekit.files.upload({
          file: createReadStream(file.path),
          fileName: file.originalname,
          folder: "stories",
        });

        media_url.push(response.url);
      } finally {
        await fs.unlink(file.path).catch(() => {});
      }
    }

    const story = await Story.create({
      userId: user._id,
      content,
      media_url,
      story_type,
      background_color,
    });

    await inngest.send({
      name: "app/story-deleted",
      data: {
        storyId: story._id.toString(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
    console.error("Add Story Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const user = await User.findOne({ clerkId }).select("_id following").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userIds = [user._id, ...(user.following || [])];

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
      userId: { $in: userIds },
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .populate("userId", "username profile_picture")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("Get User Stories Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
