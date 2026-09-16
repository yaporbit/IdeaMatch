const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email bio interests")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Post cannot be empty"
            });
        }

        const post = await Post.create({
            content: content.trim(),
            author: req.user.id
        });

        const populatedPost = await post.populate(
            "author",
            "name email bio interests"
        );

        res.status(201).json(populatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create post"
        });
    }
});

module.exports = router;