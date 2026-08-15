import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";
import api from "../services/api";

function PendingRequests() {

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/pending-requests", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRequests(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const acceptRequest = async (requestId) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/users/accept-request/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Connection Accepted 🎉");

            fetchRequests();

        } catch (error) {

            console.log(error.response?.data);

        }

    };

    return (

        <div>
                <Navbar/>
            <h1>Pending Requests</h1>

            {requests.map((request) => (

                <div key={request._id}>

                    <p>Request ID: {request._id}</p>

                    <button onClick={() => acceptRequest(request._id)}>
                        Accept
                    </button>

                    <hr />

                </div>

            ))}

        </div>

    );

}

export default PendingRequests;