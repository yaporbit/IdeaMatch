import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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

            setRequests(
                requests.filter(
                    (request) => request._id !== requestId
                )
            );

            alert("Connection accepted!");
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Failed to accept request"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Connection Requests
                    </h1>

                    <p className="text-gray-500 mt-2">
                        People who want to connect with you.
                    </p>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                        <div className="text-4xl mb-3">
                            📭
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            No pending requests
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {requests.map((request) => (
                            <div
                                key={request._id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                                        {request.fromUserId?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-lg text-gray-900">
                                            {request.fromUserId?.name ||
                                                "User"}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {request.fromUserId?.email ||
                                                "Wants to connect with you"}
                                        </p>

                                        {request.fromUserId?.bio && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {request.fromUserId.bio}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        acceptRequest(request._id)
                                    }
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Accept
                                </button>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default PendingRequests;