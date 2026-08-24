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

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-5xl px-6 py-10">

                <div className="mb-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Your Network
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        My Connections
                    </h1>

                    <p className="mt-2 text-slate-500">
                        People you've connected with on IdeaMatch.
                    </p>

                </div>


                {connections.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <div className="text-4xl">
                            🤝
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            No connections yet
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Head over to Discover and find someone to build with.
                        </p>

                        <button
                            onClick={() => navigate("/discover")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Discover Developers
                        </button>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {connections.map((user) => (

                            <div
                                key={user._id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="flex items-center justify-between gap-6">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>

                                            <h2 className="text-xl font-bold text-slate-900">
                                                {user.name}
                                            </h2>

                                            <p className="text-sm text-slate-500">
                                                {user.email}
                                            </p>

                                            <p className="mt-2 text-sm text-slate-700">
                                                {user.bio || "No bio added yet."}
                                            </p>

                                            {user.interests?.length > 0 && (

                                                <div className="mt-3 flex flex-wrap gap-2">

                                                    {user.interests.map((interest, index) => (

                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                                                        >
                                                            {interest}
                                                        </span>

                                                    ))}

                                                </div>

                                            )}

                                        </div>

                                    </div>


                                    <button
                                        onClick={() => navigate(`/chat/${user._id}`)}
                                        className="shrink-0 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                                    >
                                        💬 Chat
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

}

export default Connections;