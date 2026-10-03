import express from "express";

import {
    sendMessage,
    messageStream,
    getRecentChats,
    getReceivedMessages,
    getSentMessages,
    getConversation,
    deleteMessageForSender,
    deleteMessageForReceiver,
    markMessageAsRead,
} from "../controllers/messagecontroller.js";

import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const messageRouter = express.Router();

// ======================================================
// SEND MESSAGE
// ======================================================

messageRouter.post(
    "/send",
    protect,
    upload.single("file"),
    sendMessage
);

// ======================================================
// REAL-TIME MESSAGE STREAM
// ======================================================

messageRouter.get(
    "/stream",
    protect,
    messageStream
);

// ======================================================
// RECENT CHATS
// ======================================================

messageRouter.get(
    "/recent",
    protect,
    getRecentChats
);

// ======================================================
// RECEIVED MESSAGES
// ======================================================

messageRouter.get(
    "/received",
    protect,
    getReceivedMessages
);

// ======================================================
// SENT MESSAGES
// ======================================================

messageRouter.get(
    "/sent",
    protect,
    getSentMessages
);

// ======================================================
// CONVERSATION
// ======================================================

messageRouter.get(
    "/conversation/:userId",
    protect,
    getConversation
);

// ======================================================
// DELETE MESSAGE FOR SENDER
// ======================================================

messageRouter.delete(
    "/:messageId/sender",
    protect,
    deleteMessageForSender
);

// ======================================================
// DELETE MESSAGE FOR RECEIVER
// ======================================================

messageRouter.delete(
    "/:messageId/receiver",
    protect,
    deleteMessageForReceiver
);

// ======================================================
// MARK MESSAGE AS READ
// ======================================================

messageRouter.patch(
    "/:messageId/read",
    protect,
    markMessageAsRead
);

export default messageRouter;