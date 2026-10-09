import { getAuth } from "@clerk/express";
import User from "../models/user.js";
import Report from "../models/report.js";

export const reportUser = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { reportedUserId, reason, details = "" } = req.body;

    if (!clerkId) {
      return res.status(401).json({
        message: "Please sign in to report a user.",
      });
    }

    if (!reportedUserId || !reason) {
      return res.status(400).json({
        message: "Reported user and reason are required.",
      });
    }

    const validReasons = [
      "spam",
      "harassment",
      "hate",
      "impersonation",
      "inappropriate",
      "other",
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        message: "Invalid report reason.",
      });
    }

    if (typeof details !== "string" || details.length > 1000) {
      return res.status(400).json({
        message: "Details must be 1000 characters or fewer.",
      });
    }

    const reporter = await User.findOne({ clerkId });

    if (!reporter) {
      return res.status(404).json({
        message: "Your user profile was not found.",
      });
    }

    const reportedUser = await User.findById(reportedUserId);

    if (!reportedUser) {
      return res.status(404).json({
        message: "The user you are reporting was not found.",
      });
    }

    if (reporter._id.equals(reportedUser._id)) {
      return res.status(400).json({
        message: "You cannot report your own account.",
      });
    }

    const report = await Report.create({
      reporterId: reporter._id,
      reportedUserId: reportedUser._id,
      reason,
      details: details.trim(),
    });

    return res.status(201).json({
      message: "Report submitted successfully.",
      reportId: report._id,
    });
  } catch (error) {
    console.error("Report user error:", error);

    return res.status(500).json({
      message: "Failed to submit report.",
    });
  }
};