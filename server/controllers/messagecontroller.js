import mongoose from "mongoose";
import fs from "fs/promises";
import { createReadStream } from "fs";

import { getAuth } from "@clerk/express";

import User from "../models/user.js";
import Message from "../models/messages.js";

import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ======================================================
// ACTIVE SSE CONNECTIONS
// ======================================================

const activeConnections = new Map();

// ======================================================
// GET CURRENT MONGODB USER
// ======================================================

const getCurrentUser = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return null;
    }

    const user = await User.findOne({
        clerkId: userId,
    });

    return user;
};

// ======================================================
// MESSAGE STREAM - SSE
// ======================================================

export const messageStream = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.flushHeaders();

        activeConnections.set(user._id.toString(), res);

        res.write(
            `event: connected\n` +
            `data: ${JSON.stringify({
                success: true,
                message: "SSE connection established",
            })}\n\n`
        );

        const heartbeat = setInterval(() => {
            res.write(": heartbeat\n\n");
        }, 30000);

        req.on("close", () => {
            clearInterval(heartbeat);

            activeConnections.delete(user._id.toString());

            console.log(
                `SSE disconnected: ${user._id.toString()}`
            );
        });

    } catch (error) {
        console.error("Message stream error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

// ======================================================
// SEND MESSAGE
// ======================================================

export const sendMessage = async (req, res) => {
    let uploadedFilePath = null;

    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            receiverId,
            content = "",
            messageType = "text",
        } = req.body;

        if (
            !receiverId ||
            !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID",
            });
        }

        if (user._id.toString() === receiverId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a message to yourself",
            });
        }

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found",
            });
        }

        const allowedTypes = [
            "text",
            "image",
            "video",
            "file",
        ];

        if (!allowedTypes.includes(messageType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message type",
            });
        }

        let messageContent = content;

        // ======================================================
        // HANDLE MEDIA MESSAGE
        // ======================================================

        if (
            messageType === "image" ||
            messageType === "video" ||
            messageType === "file"
        ) {
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: `Please upload a ${messageType}`,
                });
            }

            uploadedFilePath = file.path;

            // ======================================================
            // VALIDATE IMAGE TYPE
            // ======================================================

            if (
                messageType === "image" &&
                !file.mimetype.startsWith("image/")
            ) {
                await fs.unlink(file.path).catch(() => {});

                return res.status(400).json({
                    success: false,
                    message: "Only image files are allowed",
                });
            }

            // ======================================================
            // VALIDATE VIDEO TYPE
            // ======================================================

            if (
                messageType === "video" &&
                !file.mimetype.startsWith("video/")
            ) {
                await fs.unlink(file.path).catch(() => {});

                return res.status(400).json({
                    success: false,
                    message: "Only video files are allowed",
                });
            }

            const uploadResponse =
                await imagekit.files.upload({
                    file: createReadStream(file.path),
                    fileName: file.originalname,
                    folder: `messages/${messageType}s`,
                });

            messageContent = uploadResponse.url;

            await fs.unlink(file.path).catch(() => {});

            uploadedFilePath = null;
        }

        // ======================================================
        // CREATE MESSAGE
        // ======================================================

        const message = await Message.create({
            senderId: user._id,
            receiverId: receiver._id,
            content: messageContent,
            messageType,
        });

        // ======================================================
        // POPULATE MESSAGE
        // ======================================================

        const populatedMessage = await Message.findById(
            message._id
        )
            .populate(
                "senderId",
                "username full_name profile_picture"
            )
            .populate(
                "receiverId",
                "username full_name profile_picture"
            );

        // ======================================================
        // SEND MESSAGE THROUGH SSE
        // ======================================================

        const receiverConnection =
            activeConnections.get(
                receiver._id.toString()
            );

        if (receiverConnection) {
            receiverConnection.write(
                `event: new-message\n` +
                `data: ${JSON.stringify(
                    populatedMessage
                )}\n\n`
            );
        }

        return res.status(201).json({
            success: true,
            message: populatedMessage,
            deliveredRealtime: !!receiverConnection,
        });

    } catch (error) {
        console.error("Send message error:", error);

        if (uploadedFilePath) {
            await fs.unlink(uploadedFilePath).catch(() => {});
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// GET RECENT CHATS
// ======================================================

export const getRecentChats = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const currentUserId = user._id;

        // ======================================================
        // GET LATEST MESSAGE OF EACH CONVERSATION
        // ======================================================

        const recentChats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            senderId: currentUserId,
                        },
                        {
                            receiverId: currentUserId,
                        },
                    ],
                },
            },

            // ======================================================
            // FIND THE OTHER USER
            // ======================================================

            {
                $addFields: {
                    otherUserId: {
                        $cond: [
                            {
                                $eq: [
                                    "$senderId",
                                    currentUserId,
                                ],
                            },
                            "$receiverId",
                            "$senderId",
                        ],
                    },
                },
            },

            // ======================================================
            // SORT NEWEST MESSAGE FIRST
            // ======================================================

            {
                $sort: {
                    createdAt: -1,
                },
            },

            // ======================================================
            // KEEP ONLY ONE MESSAGE PER USER
            // ======================================================

            {
                $group: {
                    _id: "$otherUserId",
                    lastMessage: {
                        $first: "$$ROOT",
                    },
                },
            },

            // ======================================================
            // SORT CONVERSATIONS BY LAST MESSAGE
            // ======================================================

            {
                $sort: {
                    "lastMessage.createdAt": -1,
                },
            },
        ]);

        // ======================================================
        // GET USER DETAILS + UNREAD COUNT
        // ======================================================

        const formattedChats = await Promise.all(
            recentChats.map(async (chat) => {
                const otherUser = await User.findById(
                    chat._id
                ).select(
                    "_id clerkId username email full_name profile_picture"
                );

                if (!otherUser) {
                    return null;
                }

                const unreadCount =
                    await Message.countDocuments({
                        senderId: chat._id,
                        receiverId: currentUserId,
                        read: false,
                    });

                return {
                    user: otherUser,

                    lastMessage: {
                        _id: chat.lastMessage._id,
                        content:
                            chat.lastMessage.content,
                        messageType:
                            chat.lastMessage.messageType,
                        senderId:
                            chat.lastMessage.senderId,
                        receiverId:
                            chat.lastMessage.receiverId,
                        read: chat.lastMessage.read,
                        createdAt:
                            chat.lastMessage.createdAt,
                    },

                    unreadCount,
                };
            })
        );

        return res.status(200).json({
            success: true,
            recentChats: formattedChats.filter(
                Boolean
            ),
        });

    } catch (error) {
        console.error("Get recent chats error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// GET RECEIVED MESSAGES
// ======================================================

export const getReceivedMessages = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const messages = await Message.find({
            receiverId: user._id,
            deletedByReceiver: false,
        })
            .populate(
                "senderId",
                "username full_name profile_picture"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.error(
            "Get received messages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// GET SENT MESSAGES
// ======================================================

export const getSentMessages = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const messages = await Message.find({
            senderId: user._id,
            deletedBySender: false,
        })
            .populate(
                "receiverId",
                "username full_name profile_picture"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.error(
            "Get sent messages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// GET CONVERSATION
// ======================================================

export const getConversation = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const { userId } = req.params;

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const otherUser = await User.findById(userId);

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const messages = await Message.find({
            $or: [
                {
                    senderId: user._id,
                    receiverId: otherUser._id,
                    deletedBySender: false,
                },
                {
                    senderId: otherUser._id,
                    receiverId: user._id,
                    deletedByReceiver: false,
                },
            ],
        })
            .populate(
                "senderId",
                "username full_name profile_picture"
            )
            .populate(
                "receiverId",
                "username full_name profile_picture"
            )
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            user: otherUser,
            messages,
        });

    } catch (error) {
        console.error(
            "Get conversation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// DELETE MESSAGE FOR SENDER
// ======================================================

export const deleteMessageForSender = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const { messageId } = req.params;

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            senderId: user._id,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        message.deletedBySender = true;

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message deleted for you",
        });

    } catch (error) {
        console.error(
            "Delete message for sender error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// DELETE MESSAGE FOR RECEIVER
// ======================================================

export const deleteMessageForReceiver = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const { messageId } = req.params;

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            receiverId: user._id,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        message.deletedByReceiver = true;

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message deleted for you",
        });

    } catch (error) {
        console.error(
            "Delete message for receiver error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================================
// MARK MESSAGE AS READ
// ======================================================

export const markMessageAsRead = async (req, res) => {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const { messageId } = req.params;

        if (
            !messageId ||
            !mongoose.Types.ObjectId.isValid(messageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await Message.findOneAndUpdate(
            {
                _id: messageId,
                receiverId: user._id,
            },
            {
                read: true,
            },
            {
                new: true,
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        return res.status(200).json({
            success: true,
            message,
        });

    } catch (error) {
        console.error(
            "Mark message as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};