import "./Chat.css";

import Navbar from "../components/Navbar";

import { useEffect, useState ,useRef} from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";

function Chat() {

    const { userId } = useParams();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isOnline, setIsOnline] = useState(false);
    const [myId, setMyId] = useState("");
    const [otherUser, setOtherUser] = useState(null);
    const bottomRef = useRef(null);


    // Load user id and old messages
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));

        setMyId(payload.id);

        socket.emit("register", payload.id);

        fetchMessages(token);
        fetchOtherUser(token);

    }, []);

    // Listen for incoming messages
    useEffect(() => {

        socket.on("privateMessage", (newMessage) => {

            setMessages((prev) => [...prev, newMessage]);

        });

        return () => {

            socket.off("privateMessage");

        };

    }, []);


    useEffect(() => {

    socket.on("onlineUsers", (users) => {

        if (users.includes(userId)) {
            setIsOnline(true);
        }

    });

    socket.on("userOnline", (onlineUserId) => {

        if (onlineUserId === userId) {
            setIsOnline(true);
        }

    });

    socket.on("userOffline", (offlineUserId) => {

        if (offlineUserId === userId) {
            setIsOnline(false);
        }

    });

    return () => {

        socket.off("onlineUsers");
        socket.off("userOnline");
        socket.off("userOffline");

    };

}, [userId]);


useEffect(() => {

    bottomRef.current?.scrollIntoView({
        behavior: "smooth"
    });

}, [messages]);





    const fetchMessages = async (token) => {

        try {

            const res = await api.get(`/messages/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages(res.data);

        } catch (error) {

            console.log(error);

        }

    };

       
    const fetchOtherUser = async (token) => {

    try {

        const res = await api.get("/users/discover", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = res.data.find((u) => u._id === userId);

        setOtherUser(user);

    } catch (error) {

        console.log(error);

    }

};


    const sendMessage = () => {

        if (message.trim() === "") return;

        const token = localStorage.getItem("token");

        const payload = JSON.parse(atob(token.split(".")[1]));

        const fromUserId = payload.id;

        socket.emit("privateMessage", {

            fromUserId,
            toUserId: userId,
            message

        });

        // Show instantly on sender screen
        setMessages((prev) => [
            ...prev,
            {
                sender: fromUserId,
                receiver: userId,
                message
            }
        ]);

        setMessage("");

    };

    return (

        <div className="chat-container">
            <Navbar/>

            <div className="chat-header">

    <h2>
        💬 {otherUser ? otherUser.name : "Loading..."}
    </h2>

    <p className={isOnline ? "online-status" : "offline-status"}>
        {isOnline ? "🟢 Online" : "⚫ Offline"}
    </p>

</div>


<div className="chat-box">

    {messages.map((msg, index) => (

        <div
            key={msg._id || index}
            className={
                msg.sender === myId
                    ? "my-message"
                    : "other-message"
            }
        >

            <div className="bubble">

    <div>
        {msg.message}
    </div>

    {msg.createdAt && (
        <small>
            {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}
        </small>
    )}

</div>

        </div>

    ))}

    <div ref={bottomRef}></div>

</div>


            <div className="input-area">

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>

        </div>

    );

}

export default Chat;