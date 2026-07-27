const ConnectionRequest = require("../models/connectionRequest");

const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("User Route Working");
});

router.post("/signup", async (req, res) => {
console.log(req.body);
    try {
const hashedPassword = await bcrypt.hash(req.body.password, 10);

        req.body.password = hashedPassword;
        const user = await User.create(req.body);

       

        res.status(201).json({
            message: "User Created Successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }



});




router.post("/login", async (req, res) => {
    const user = await User.findOne({
    email: req.body.email
});

if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}

const isMatch = await bcrypt.compare(
    req.body.password,
    user.password
);
if (!isMatch) {
    return res.status(401).json({
        message: "Invalid Password"
    });
}
    const token = jwt.sign(
    {
        id: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.status(200).json({
    message: "Login Successful",
    token
});


});


router.get("/profile", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.id).select("-password");


    res.status(200).json(user);

});


router.put("/profile", authMiddleware, async (req, res) => {

    try {

        const updatedData = {
            name: req.body.name,
            bio: req.body.bio,
            interests: req.body.interests
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updatedData,
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.get("/", authMiddleware, async (req, res) => {

    try {

        const users = await User.find({
            _id: {
                $ne: req.user.id
            }
        }).select("-password");

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.post("/send-request/:userId", authMiddleware, async (req, res) => {

    try {

        // 1. Self request check
        if (req.user.id === req.params.userId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        // 2. Duplicate request check
        const existingRequest = await ConnectionRequest.findOne({
            fromUserId: req.user.id,
            toUserId: req.params.userId
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Connection request already sent"
            });
        }

        // 3. Create request
        const request = await ConnectionRequest.create({
            fromUserId: req.user.id,
            toUserId: req.params.userId
        });

        res.status(201).json(request);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.put("/accept-request/:requestId", authMiddleware, async (req, res) => {

    try {

        // Step 1: Find the request
        const request = await ConnectionRequest.findById(req.params.requestId);

        // Step 2: Check if request exists
        if (!request) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        // ⭐⭐⭐ STEP 4 GOES HERE ⭐⭐⭐
        if (request.toUserId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to accept this request"
            });
        }

        // Step 5: Update status
        request.status = "accepted";

        // Step 6: Save
        await request.save();

        // Step 7: Send response
        res.status(200).json({
            message: "Connection request accepted",
            request
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




router.get("/pending-requests", authMiddleware, async (req, res) => {

    try {

        const requests = await ConnectionRequest.find({

            toUserId: req.user.id,

            status: "pending"

        });

        res.status(200).json(requests);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



router.get("/connections", authMiddleware, async (req, res) => {

    try {

        // Step 1: Get all accepted connections
        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { fromUserId: req.user.id },
                { toUserId: req.user.id }
            ]
        })
        .populate("fromUserId", "name email bio interests")
        .populate("toUserId", "name email bio interests");

        // ⭐ Step 2: Transform the data
        const users = connections.map((connection) => {

            if (connection.fromUserId._id.toString() === req.user.id) {
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }

        });

        // Step 3: Send only the other users
        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;