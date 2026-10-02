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
            required: true,
            trim: true,
        },

        image_url: {
            type: [String],
            default: [],
        },

        story_type: {
            type: String,
            enum: ["text", "image", "image_text"],
            required: true,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Story = mongoose.model("Story", storySchema);