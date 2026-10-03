import { Inngest } from "inngest";

import User from "../models/user.js";
import connectionModel from "../models/connection.js";
import sendEmail from "../config/nodemailer.js";
import { Story } from "../models/story.js";
import Message from "../models/messages.js";

// ======================================================
// INNGEST CLIENT
// ======================================================

export const inngest = new Inngest({
    id: "TwixChat-app",
});

// ======================================================
// CREATE USER FROM CLERK
// ======================================================

const syncUsercreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: {
            event: "clerk/user.created",
        },
    },

    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address || "";

        let username =
            email.split("@")[0] ||
            `user_${id.slice(-8)}`;

        // ==================================================
        // CHECK USERNAME
        // ==================================================

        const existingUser = await User.findOne({
            username,
        });

        if (existingUser) {
            username =
                `${username}_${Math.floor(
                    Math.random() * 10000
                )}`;
        }

        // ==================================================
        // CREATE MONGODB USER
        // ==================================================

        await User.create({
            clerkId: id,
            full_name:
                `${first_name || ""} ${
                    last_name || ""
                }`.trim(),
            username,
            email,
            profile_picture: image_url || "",
        });
    }
);

// ======================================================
// UPDATE USER FROM CLERK
// ======================================================

const syncUserupdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
        triggers: {
            event: "clerk/user.updated",
        },
    },

    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address || "";

        const updatedUserData = {
            full_name:
                `${first_name || ""} ${
                    last_name || ""
                }`.trim(),
            email,
            profile_picture: image_url || "",
        };

        // ==================================================
        // UPDATE USING CLERK ID
        // ==================================================

        await User.findOneAndUpdate(
            {
                clerkId: id,
            },
            updatedUserData,
            {
                new: true,
            }
        );
    }
);

// ======================================================
// DELETE USER WITH CLERK
// ======================================================

const syncUserdeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk",
        triggers: {
            event: "clerk/user.deleted",
        },
    },

    async ({ event }) => {
        const { id } = event.data;

        // ==================================================
        // DELETE USING CLERK ID
        // ==================================================

        await User.findOneAndDelete({
            clerkId: id,
        });
    }
);

// ======================================================
// SEND EMAIL FOR CONNECTION REQUEST
// ======================================================

const sendnewconnectionrequestemail =
    inngest.createFunction(
        {
            id: "send-new-connection-request-email",
            triggers: {
                event: "app/connection-request",
            },
        },

        async ({ event, step }) => {
            const { connectionId } = event.data;

            // ==================================================
            // GET CONNECTION
            // ==================================================

            const connection = await step.run(
                "get-connection",
                async () => {
                    return await connectionModel
                        .findById(connectionId)
                        .populate("from_user_Id")
                        .populate("to_user_Id");
                }
            );

            if (!connection) {
                throw new Error(
                    "Connection not found"
                );
            }

            // ==================================================
            // CHECK USERS
            // ==================================================

            if (
                !connection.from_user_Id ||
                !connection.to_user_Id
            ) {
                throw new Error(
                    "Connection users not found"
                );
            }

            // ==================================================
            // CREATE EMAIL
            // ==================================================

            const subject =
                "New Connection Request";

            const emailBody = `
                <p>
                    Hello ${
                        connection.to_user_Id.full_name
                    },
                </p>

                <p>
                    You have a new connection request
                    from ${
                        connection.from_user_Id.full_name
                    }.
                </p>

                <p>
                    Click
                    <a href="${process.env.FRONTEND_URL}/connections">
                        here
                    </a>
                    to view the request.
                </p>

                <p>
                    Best regards,<br/>
                    TwixChat Team
                </p>
            `;

            // ==================================================
            // SEND EMAIL
            // ==================================================

            await step.run(
                "send-connection-email",
                async () => {
                    await sendEmail(
                        connection.to_user_Id.email,
                        "New Connection Request",
                        subject,
                        emailBody
                    );
                }
            );

            return {
                success: true,
                connectionId,
            };
        }
    );

// ======================================================
// DELETE STORY AFTER 24 HOURS
// ======================================================

const deleteStoryAfter24Hours =
    inngest.createFunction(
        {
            id: "delete-story-after-24-hours",
            triggers: {
                event: "app/story-deleted",
            },
        },

        async ({ event, step }) => {
            const { storyId } = event.data;

            // ==================================================
            // WAIT 24 HOURS
            // ==================================================

            await step.sleep(
                "wait-24-hours",
                "24h"
            );

            // ==================================================
            // DELETE STORY
            // ==================================================

            await step.run(
                "delete-story",
                async () => {
                    await Story.findByIdAndDelete(
                        storyId
                    );
                }
            );

            return {
                success: true,
                storyId,
            };
        }
    );

// ======================================================
// SEND NEW MESSAGE NOTIFICATION
// ======================================================

const sendNewMessageNotification =
    inngest.createFunction(
        {
            id: "send-new-message-notification",
            triggers: {
                event: "app/message-sent",
            },
        },

        async ({ event, step }) => {
            const { messageId } = event.data;

            // ==================================================
            // GET MESSAGE
            // ==================================================

            const message = await step.run(
                "get-message",
                async () => {
                    return await Message.findById(
                        messageId
                    )
                        .populate(
                            "senderId",
                            "username full_name profile_picture"
                        )
                        .populate(
                            "receiverId",
                            "username full_name email"
                        );
                }
            );

            // ==================================================
            // CHECK MESSAGE
            // ==================================================

            if (!message) {
                throw new Error(
                    "Message not found"
                );
            }

            if (
                !message.senderId ||
                !message.receiverId
            ) {
                throw new Error(
                    "Sender or receiver not found"
                );
            }

            // ==================================================
            // GET SENDER NAME
            // ==================================================

            const senderName =
                message.senderId.full_name ||
                message.senderId.username ||
                "Someone";

            // ==================================================
            // CREATE NOTIFICATION TEXT
            // ==================================================

            let notificationText;

            switch (message.messageType) {
                case "image":
                    notificationText =
                        `${senderName} sent you an image`;
                    break;

                case "video":
                    notificationText =
                        `${senderName} sent you a video`;
                    break;

                case "file":
                    notificationText =
                        `${senderName} sent you a file`;
                    break;

                default: {
                    const text =
                        message.content?.trim() ||
                        "sent you a message";

                    const preview =
                        text.length > 100
                            ? `${text.slice(0, 100)}...`
                            : text;

                    notificationText =
                        `${senderName}: ${preview}`;
                }
            }

            // ==================================================
            // CREATE EMAIL
            // ==================================================

            const subject =
                `New message from ${senderName}`;

            const emailBody = `
                <div>
                    <h2>New Message</h2>

                    <p>
                        ${notificationText}
                    </p>

                    <p>
                        Click
                        <a href="${process.env.FRONTEND_URL}/messages">
                            here
                        </a>
                        to open TwixChat.
                    </p>

                    <p>
                        Best regards,<br/>
                        TwixChat Team
                    </p>
                </div>
            `;

            // ==================================================
            // SEND EMAIL
            // ==================================================

            await step.run(
                "send-message-email",
                async () => {
                    await sendEmail(
                        message.receiverId.email,
                        subject,
                        subject,
                        emailBody
                    );
                }
            );

            return {
                success: true,
                messageId:
                    message._id.toString(),
                receiverId:
                    message.receiverId._id.toString(),
                notification:
                    notificationText,
            };
        }
    );

// ======================================================
// EXPORT ALL INNGEST FUNCTIONS
// ======================================================

export const functions = [
    syncUsercreation,
    syncUserupdation,
    syncUserdeletion,
    sendnewconnectionrequestemail,
    deleteStoryAfter24Hours,
    sendNewMessageNotification,
];