import express from "express";

import { sendMessage,
    getReceivedMessages,
    getSentMessages,
    getConversation,
    deleteMessageForSender,
    deleteMessageForReceiver,
    markMessageAsRead
} from "../controllers/messagecontroller.js";
import { protect } from "../middleware/auth.js";


const messageRouter = express.Router();


// ======================================================
// SEND MESSAGE
// ======================================================

messageRouter.post(
    "/send",
    protect,
    sendMessage
);


// ======================================================
// GET RECEIVED MESSAGES
// ======================================================

messageRouter.get(
    "/received",
    protect,
    getReceivedMessages
);


// ======================================================
// GET SENT MESSAGES
// ======================================================

messageRouter.get(
    "/sent",
    protect,
    getSentMessages
);


// ======================================================
// GET CONVERSATION
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