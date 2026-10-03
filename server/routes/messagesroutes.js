import express from "express";

import {
    sendMessage,
    messageStream,
    getReceivedMessages,
    getSentMessages,
    getConversation,
    deleteMessageForSender,
    deleteMessageForReceiver,
    markMessageAsRead
} from "../controllers/messagecontroller.js";

import { protect } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.post(
    "/send",
    protect,
    sendMessage
);

messageRouter.get(
    "/stream",
    protect,
    messageStream
);

messageRouter.get(
    "/received",
    protect,
    getReceivedMessages
);

messageRouter.get(
    "/sent",
    protect,
    getSentMessages
);

messageRouter.get(
    "/conversation/:userId",
    protect,
    getConversation
);

messageRouter.delete(
    "/:messageId/sender",
    protect,
    deleteMessageForSender
);

messageRouter.delete(
    "/:messageId/receiver",
    protect,
    deleteMessageForReceiver
);

messageRouter.patch(
    "/:messageId/read",
    protect,
    markMessageAsRead
);

export default messageRouter;