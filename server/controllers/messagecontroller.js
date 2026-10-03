import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import User from "../models/user.js";
import Message from "../models/message.js";


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

        // Tell frontend connection is successful
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

            if (activeConnections.get(userId) === res) {
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

        if (!content || !content.trim()) {
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
        // SEND MESSAGE THROUGH SSE
        // ==================================================

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

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: populatedMessage,
            deliveredRealtime: !!receiverConnection
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