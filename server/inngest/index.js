import { Inngest } from "inngest";
import User from "../models/user.js";
import connectionModel from "../models/connection.js";
import sendEmail from "../config/nodemailer.js";
import { Story } from "../models/story.js";


// ======================================================
// INNGEST CLIENT
// ======================================================

export const inngest = new Inngest({
    id: "TwixChat-app"
});


// ======================================================
// CREATE USER FROM CLERK
// ======================================================

const syncUsercreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: {
            event: "clerk/user.created"
        }
    },

    async ({ event }) => {

        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address || "";

        let username =
            email.split("@")[0] || `user_${id.slice(-8)}`;

        // ==================================================
        // CHECK USERNAME
        // ==================================================

        const existingUser =
            await User.findOne({ username });

        if (existingUser) {
            username =
                username +
                Math.floor(Math.random() * 10000);
        }

        // ==================================================
        // CREATE MONGODB USER
        // ==================================================

        const userData = {
            clerkId: id,
            full_name:
                `${first_name || ""} ${last_name || ""}`.trim(),
            username,
            email,
            profile_picture: image_url || ""
        };

        await User.create(userData);
    }
);


// ======================================================
// UPDATE USER FROM CLERK
// ======================================================

const syncUserupdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
        triggers: {
            event: "clerk/user.updated"
        }
    },

    async ({ event }) => {

        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address || "";

        const updatedUserData = {
            full_name:
                `${first_name || ""} ${last_name || ""}`.trim(),
            email,
            profile_picture: image_url || ""
        };

        // ==================================================
        // UPDATE USING CLERK ID
        // ==================================================

        await User.findOneAndUpdate(
            { clerkId: id },
            updatedUserData
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
            event: "clerk/user.deleted"
        }
    },

    async ({ event }) => {

        const { id } = event.data;

        // ==================================================
        // DELETE USING CLERK ID
        // ==================================================

        await User.findOneAndDelete({
            clerkId: id
        });
    }
);


// ======================================================
// SEND EMAIL FOR CONNECTION REQUEST
// ======================================================

const sendnewconnectionrequestemail = inngest.createFunction(
    {
        id: "send-new-connection-request-email",
        triggers: {
            event: "app/connection-request"
        }
    },

    async ({ event, step }) => {

        const { connectionId } = event.data;

        // ==================================================
        // GET CONNECTION
        // ==================================================

        await step.run("send-email", async () => {

            const connection =
                await connectionModel
                    .findById(connectionId)
                    .populate("from_user_Id")
                    .populate("to_user_Id");

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
                <p>Hello ${connection.to_user_Id.full_name},</p>

                <p>
                    You have a new connection request from
                    ${connection.from_user_Id.full_name}.
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

            await sendEmail(
                connection.to_user_Id.email,
                "New Connection Request",
                subject,
                emailBody
            );
        });
    }
);


// ======================================================
// DELETE STORY AFTER 24 HOURS
// ======================================================

const deleteStoryAfter24Hours = inngest.createFunction(
    {
        id: "delete-story-after-24-hours",
        triggers: {
            event: "app/story-deleted"
        }
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
            storyId
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
    deleteStoryAfter24Hours
];