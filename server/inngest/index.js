import { Inngest } from "inngest";
import User from "../models/user.js";

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

export const functions = [
    syncUsercreation,
    syncUserupdation,
    syncUserdeletion
];