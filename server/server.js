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

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());


connectDB();

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});



const onlineUsers = {};

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("register", (userId) => {

        onlineUsers[userId] = socket.id;

        console.log("Online Users:", onlineUsers);

    });



    socket.on("privateMessage", async (data) => {

    try {

        await Message.create({

            sender: data.fromUserId,

            receiver: data.toUserId,

            message: data.message

        });

        const receiverSocket = onlineUsers[data.toUserId];

        if (receiverSocket) {

            io.to(receiverSocket).emit("privateMessage", data);

        }

    } catch (error) {

        console.log(error);

    }

});




    socket.on("disconnect", () => {

    console.log("User Disconnected:", socket.id);

    for (const userId in onlineUsers) {

        if (onlineUsers[userId] === socket.id) {

            delete onlineUsers[userId];

            break;

        }

    }

    console.log("Online Users:", onlineUsers);

});

});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});