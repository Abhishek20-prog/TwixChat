import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import User from "../models/user.js";
import Message from "../models/messages.js";


// ======================================================
// ACTIVE SSE CONNECTIONS
// ======================================================

const activeConnections = new Map();


// ======================================================
// HELPER: GET CURRENT MONGODB USER
// ======================================================

const getCurrentUser = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return null;
    }

    const user = await User.findOne({
        clerkId: userId
    });

    return user;
};


// ======================================================
// SSE MESSAGE STREAM
// ======================================================

export const messageStream = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // ==================================================
        // SET SSE HEADERS
        // ==================================================

        res.setHeader(
            "Content-Type",
            "text/event-stream"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        res.flushHeaders();

        const userId = user._id.toString();

        // ==================================================
        // STORE ACTIVE CONNECTION
        // ==================================================

        activeConnections.set(userId, res);

        // ==================================================
        // SEND CONNECTION EVENT
        // ==================================================

        res.write(
            `event: connected\n` +
            `data: ${JSON.stringify({
                success: true,
                message: "SSE connected"
            })}\n\n`
        );

        // ==================================================
        // KEEP CONNECTION ALIVE
        // ==================================================

        const heartbeat = setInterval(() => {
            res.write(": heartbeat\n\n");
        }, 30000);

        // ==================================================
        // HANDLE DISCONNECT
        // ==================================================

        req.on("close", () => {
            clearInterval(heartbeat);

            if (
                activeConnections.get(userId) === res
            ) {
                activeConnections.delete(userId);
            }
        });

    } catch (error) {
        console.error(
            "messageStream error:",
            error
        );

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        res.end();
    }
};


// ======================================================
// SEND MESSAGE
// ======================================================

export const sendMessage = async (req, res) => {
    try {
        const sender = await getCurrentUser(req);

        if (!sender) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const {
            receiverId,
            content,
            messageType = "text"
        } = req.body;

        // ==================================================
        // VALIDATE RECEIVER ID
        // ==================================================

        if (
            !receiverId ||
            !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID"
            });
        }

        // ==================================================
        // VALIDATE CONTENT
        // ==================================================

        if (
            !content ||
            typeof content !== "string" ||
            !content.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message content is required"
            });
        }

        // ==================================================
        // PREVENT SELF MESSAGE
        // ==================================================

        if (
            sender._id.toString() ===
            receiverId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot message yourself"
            });
        }

        // ==================================================
        // FIND RECEIVER
        // ==================================================

        const receiver = await User.findById(
            receiverId
        );

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }

        // ==================================================
        // VALIDATE MESSAGE TYPE
        // ==================================================

        const allowedTypes = [
            "text",
            "image",
            "video",
            "file"
        ];

        if (!allowedTypes.includes(messageType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message type"
            });
        }

        // ==================================================
        // CREATE MESSAGE
        // ==================================================

        const message = await Message.create({
            senderId: sender._id,
            receiverId: receiver._id,
            content: content.trim(),
            messageType
        });

        // ==================================================
        // POPULATE MESSAGE
        // ==================================================

        const populatedMessage =
            await Message.findById(message._id)
                .populate(
                    "senderId",
                    "username full_name profile_picture"
                )
                .populate(
                    "receiverId",
                    "username full_name profile_picture"
                );

        // ==================================================
        // CHECK RECEIVER SSE CONNECTION
        // ==================================================

        const receiverConnection =
            activeConnections.get(
                receiver._id.toString()
            );

        // ==================================================
        // SEND REAL-TIME MESSAGE
        // ==================================================

        if (receiverConnection) {
            receiverConnection.write(
                `event: new-message\n` +
                `data: ${JSON.stringify(
                    populatedMessage
                )}\n\n`
            );
        }

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: populatedMessage,
            deliveredRealtime:
                !!receiverConnection
        });

    } catch (error) {
        console.error(
            "sendMessage error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// GET RECEIVED MESSAGES
// ======================================================

export const getReceivedMessages = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const messages =
            await Message.find({
                receiverId: user._id,
                deletedByReceiver: false
            })
                .populate(
                    "senderId",
                    "username full_name profile_picture"
                )
                .populate(
                    "receiverId",
                    "username full_name profile_picture"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error(
            "getReceivedMessages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// GET SENT MESSAGES
// ======================================================

export const getSentMessages = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const messages =
            await Message.find({
                senderId: user._id,
                deletedBySender: false
            })
                .populate(
                    "senderId",
                    "username full_name profile_picture"
                )
                .populate(
                    "receiverId",
                    "username full_name profile_picture"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error(
            "getSentMessages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// GET CONVERSATION
// ======================================================

export const getConversation = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { userId } = req.params;

        // ==================================================
        // VALIDATE USER ID
        // ==================================================

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // ==================================================
        // FIND OTHER USER
        // ==================================================

        const otherUser =
            await User.findById(userId);

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ==================================================
        // GET CONVERSATION
        // ==================================================

        const messages =
            await Message.find({
                $or: [
                    {
                        senderId: user._id,
                        receiverId: otherUser._id,
                        deletedBySender: false
                    },
                    {
                        senderId: otherUser._id,
                        receiverId: user._id,
                        deletedByReceiver: false
                    }
                ]
            })
                .populate(
                    "senderId",
                    "username full_name profile_picture"
                )
                .populate(
                    "receiverId",
                    "username full_name profile_picture"
                )
                .sort({
                    createdAt: 1
                });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error(
            "getConversation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// DELETE MESSAGE FOR SENDER
// ======================================================

export const deleteMessageForSender = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { messageId } = req.params;

        // ==================================================
        // VALIDATE MESSAGE ID
        // ==================================================

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID"
            });
        }

        // ==================================================
        // FIND MESSAGE
        // ==================================================

        const message =
            await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // ==================================================
        // CHECK SENDER
        // ==================================================

        if (
            message.senderId.toString() !==
            user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own sent messages"
            });
        }

        // ==================================================
        // MARK DELETED FOR SENDER
        // ==================================================

        message.deletedBySender = true;

        // ==================================================
        // DELETE COMPLETELY IF RECEIVER ALSO DELETED
        // ==================================================

        if (message.deletedByReceiver) {
            await Message.findByIdAndDelete(
                messageId
            );
        } else {
            await message.save();
        }

        return res.status(200).json({
            success: true,
            message:
                "Message deleted for sender"
        });

    } catch (error) {
        console.error(
            "deleteMessageForSender error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// DELETE MESSAGE FOR RECEIVER
// ======================================================

export const deleteMessageForReceiver = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { messageId } = req.params;

        // ==================================================
        // VALIDATE MESSAGE ID
        // ==================================================

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID"
            });
        }

        // ==================================================
        // FIND MESSAGE
        // ==================================================

        const message =
            await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // ==================================================
        // CHECK RECEIVER
        // ==================================================

        if (
            message.receiverId.toString() !==
            user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete messages received by you"
            });
        }

        // ==================================================
        // MARK DELETED FOR RECEIVER
        // ==================================================

        message.deletedByReceiver = true;

        // ==================================================
        // DELETE COMPLETELY IF SENDER ALSO DELETED
        // ==================================================

        if (message.deletedBySender) {
            await Message.findByIdAndDelete(
                messageId
            );
        } else {
            await message.save();
        }

        return res.status(200).json({
            success: true,
            message:
                "Message deleted for receiver"
        });

    } catch (error) {
        console.error(
            "deleteMessageForReceiver error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// MARK MESSAGE AS READ
// ======================================================

export const markMessageAsRead = async (
    req,
    res
) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { messageId } = req.params;

        // ==================================================
        // VALIDATE MESSAGE ID
        // ==================================================

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID"
            });
        }

        // ==================================================
        // FIND MESSAGE
        // ==================================================

        const message =
            await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // ==================================================
        // CHECK RECEIVER
        // ==================================================

        if (
            message.receiverId.toString() !==
            user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the receiver can mark the message as read"
            });
        }

        // ==================================================
        // UPDATE READ STATUS
        // ==================================================

        message.read = true;

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message marked as read",
            data: message
        });

    } catch (error) {
        console.error(
            "markMessageAsRead error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};