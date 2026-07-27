import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await api.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);

            } catch (error) {

                console.log(error);

            }

        };

        fetchProfile();

    }, []);

    if (!user) {
        return <h2>Loading...</h2>;
    }

    return (

        <div>

            <h1>Welcome {user.name} 👋</h1>

            <p><strong>Email:</strong> {user.email}</p>

            <p><strong>Bio:</strong> {user.bio}</p>

            <p><strong>Interests:</strong> {user.interests.join(", ")}</p>

        </div>

    );

}

export default Dashboard;