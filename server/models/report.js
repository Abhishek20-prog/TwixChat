import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "spam",
        "harassment",
        "hate",
        "impersonation",
        "inappropriate",
        "other",
      ],
      required: true,
    },

    details: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);