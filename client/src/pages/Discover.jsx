import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Discover() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/discover", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const sendRequest = async (userId) => {

        try {

            const token = localStorage.getItem("token");

            await api.post(
                `/users/send-request/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Connection request sent!");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };

    const filteredUsers = users.filter((user) => {

        const text = search.toLowerCase();

        return (
            (user.name || "").toLowerCase().includes(text) ||
            (user.email || "").toLowerCase().includes(text) ||
            (user.bio || "").toLowerCase().includes(text) ||
            (user.interests || []).some((interest) =>
                interest.toLowerCase().includes(text)
            )
        );

    });

    return (

        <div>

            <Navbar />

            <div style={{ padding: "20px" }}>

                <h1>Discover Developers</h1>

                <input
                    type="text"
                    placeholder="Search by name, skill or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "400px",
                        padding: "10px",
                        marginBottom: "20px"
                    }}
                />

                {filteredUsers.length === 0 ? (

                    <p>No developers found.</p>

                ) : (

                    filteredUsers.map((user) => (

                        <div
                            key={user._id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                marginBottom: "15px",
                                borderRadius: "8px"
                            }}
                        >

                            <h3>{user.name}</h3>

                            <p>{user.email}</p>

                            <p>
                                {user.bio || "No bio added"}
                            </p>

                            <p>
                                <strong>Skills:</strong>{" "}
                                {user.interests?.length
                                    ? user.interests.join(", ")
                                    : "No skills added"}
                            </p>

                            {user.connectionStatus === "none" && (

    <button
        onClick={() => sendRequest(user._id)}
    >
        Connect
    </button>

)}

{user.connectionStatus === "sent" && (

    <button disabled>
        Request Sent
    </button>

)}

{user.connectionStatus === "received" && (

    <button disabled>
        Request Received
    </button>

)}

{user.connectionStatus === "connected" && (

    <button disabled>
        Connected
    </button>

)}

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default Discover;