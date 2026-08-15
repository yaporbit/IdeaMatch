const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            default: "connection"
        },

        read: {
            type: Boolean,
            default: false
        },

        relatedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);