import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
    {
        from_user_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        to_user_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const connectionModel = mongoose.model(
    "Connection",
    connectionSchema
);

export default connectionModel;