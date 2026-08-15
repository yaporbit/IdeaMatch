import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Connections() {
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/connections", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setConnections(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div>
         <Navbar/>
            <h1>My Connections</h1>

            {connections.map((user) => (

                <div key={user._id}>

                    <h3>{user.name}</h3>

                    <p>{user.email}</p>

                    <p>{user.bio}</p>

                    <button onClick={() => navigate(`/chat/${user._id}`)}>
    Chat
</button>

<hr />

                </div>

            ))}

        </div>

    );

}

export default Connections;