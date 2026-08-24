require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Message = require("./models/message");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

// ===============================
// CORS
// ===============================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.use(express.json());

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.status(200).send("IdeaMatch Backend Working");
});

// ===============================
// ROUTES
// ===============================

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store online users
const onlineUsers = {};

// ===============================
// SOCKET CONNECTION
// ===============================

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // ===============================
    // REGISTER USER
    // ===============================

    socket.on("register", (userId) => {
        if (!userId) {
            return;
        }

        onlineUsers[userId] = socket.id;

        console.log("User registered:", userId);
        console.log("Online Users:", onlineUsers);

        // Send current online users to newly connected user
        socket.emit(
            "onlineUsers",
            Object.keys(onlineUsers)
        );

        // Tell everyone else that this user is online
        socket.broadcast.emit(
            "userOnline",
            userId
        );
    });

    // ===============================
    // PRIVATE MESSAGE
    // ===============================

    socket.on("privateMessage", async (data) => {
        try {
            if (
                !data ||
                !data.fromUserId ||
                !data.toUserId ||
                !data.message
            ) {
                return;
            }

            // Save message to MongoDB
            await Message.create({
                sender: data.fromUserId,
                receiver: data.toUserId,
                message: data.message
            });

            // Find receiver socket
            const receiverSocket =
                onlineUsers[data.toUserId];

            // Send message if receiver is online
            if (receiverSocket) {
                io.to(receiverSocket).emit(
                    "privateMessage",
                    data
                );
            }

        } catch (error) {
            console.error(
                "Message error:",
                error.message
            );
        }
    });

    // ===============================
    // DISCONNECT
    // ===============================

    socket.on("disconnect", () => {
        console.log(
            "User Disconnected:",
            socket.id
        );

        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {

                delete onlineUsers[userId];

                // Tell everyone this user went offline
                io.emit(
                    "userOffline",
                    userId
                );

                break;
            }
        }

        console.log(
            "Online Users:",
            onlineUsers
        );
    });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );
});