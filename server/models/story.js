
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      default: "",
      trim: true,
    },

    media_url: {
      type: [String],
      default: [],
    },

    story_type: {
      type: String,
      enum: ["text", "image", "video", "image_text"],
      required: true,
    },

    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    background_color: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Story = mongoose.model("Story", storySchema);
