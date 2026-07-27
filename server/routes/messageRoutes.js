const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/message");

router.get("/:userId", authMiddleware, async (req, res) => {

    try {

        const messages = await Message.find({

            $or: [

                {
                    sender: req.user.id,
                    receiver: req.params.userId
                },

                {
                    sender: req.params.userId,
                    receiver: req.user.id
                }

            ]

        }).sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;