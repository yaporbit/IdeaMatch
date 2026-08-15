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

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ]
}));

app.use(express.json());


// ===============================
// DATABASE
// ===============================

connectDB();


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
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        methods: ["GET", "POST"]
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

    onlineUsers[userId] = socket.id;

    console.log("Online Users:", onlineUsers);

    // Tell the newly connected user who is already online
    socket.emit("onlineUsers", Object.keys(onlineUsers));

    // Tell everyone else this user is online
    socket.broadcast.emit("userOnline", userId);

});


    // ===============================
    // PRIVATE MESSAGE
    // ===============================

    socket.on("privateMessage", async (data) => {

        try {

            // Save message to MongoDB
            await Message.create({

                sender: data.fromUserId,

                receiver: data.toUserId,

                message: data.message

            });


            // Find receiver's socket
            const receiverSocket = onlineUsers[data.toUserId];


            // Send message if receiver is online
            if (receiverSocket) {

                io.to(receiverSocket).emit(
                    "privateMessage",
                    data
                );

            }

        } catch (error) {

            console.log(error);

        }

    });


    // ===============================
    // USER DISCONNECT
    // ===============================

    socket.on("disconnect", () => {

        console.log("User Disconnected:", socket.id);


        for (const userId in onlineUsers) {

            if (onlineUsers[userId] === socket.id) {

                // Remove user
                delete onlineUsers[userId];


                // Tell everyone user is offline
                io.emit("userOffline", userId);

                break;

            }

        }


        console.log("Online Users:", onlineUsers);

    });

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});