import { Inngest } from "inngest";
import User from "../models/user.js";
import connectionModel from "../models/connection.js";

export const inngest = new Inngest({
    id: "TwixChat-app"
});

const syncUsercreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: { event: "clerk/user.created" }
    },
    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        } = event.data;

        let username =
            email_addresses[0].email_address.split("@")[0];

        const user = await User.findOne({ username });

        if (user) {
            username = username + Math.floor(Math.random() * 10000);
        }

        const userData = {
            _id: id,
            full_name: first_name + " " + last_name,
            username,
            email: email_addresses[0].email_address,
            profile_picture: image_url
        };

        await User.create(userData);
    }
);

const syncUserupdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
        triggers: { event: "clerk/user.updated" }
    },
    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        } = event.data;

        const updateduserData = {
            full_name: first_name + " " + last_name,
            email: email_addresses[0].email_address,
            profile_picture: image_url
        };

        await User.findByIdAndUpdate(id, updateduserData);
    }
);

const syncUserdeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk",
        triggers: { event: "clerk/user.deleted" }
    },
    async ({ event }) => {
        const { id } = event.data;

        await User.findByIdAndDelete(id);
    }
);
// inggest function for sending email when a user receives a connection request
const sendnewconnectionrequestemail = inngest.createFunction(
    {
        id: "send-new-connection-request-email",
        triggers: { event: "app/connection-request" }
    },
    async ({ event }) => {
        const {connnectionId } = event.data;
        await step.run("send-email", async () => {
            const connection = await connectionModel.findById(connnectionId).populate('from_user_Id').populate('to_user_Id');
            const subject = "New Connection Request";
            const emailBody = `
                <p>Hello ${connection.to_user_Id.full_name},</p>
                <p>You have a new connection request from ${connection.from_user_Id.full_name}.</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections">here</a> to view the request.</p>
                <p>Best regards,<br/>TwixChat Team</p>
            `;
            await sendEmail(connection.to_user_Id.email, "New Connection Request", subject, emailBody);
        }
           
        );
    }
);

export const functions = [
    syncUsercreation,
    syncUserupdation,
    syncUserdeletion,
    sendnewconnectionrequestemail
];