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

            fetchUsers();

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

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-10">

                {/* Header */}

                <div className="mb-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Find Your People
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Discover Developers
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Find people with the skills and interests that match your ideas.
                    </p>

                </div>


                {/* Search */}

                <div className="mb-8">

                    <div className="relative max-w-2xl">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name, skill or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>


                {/* Results count */}

                <div className="mb-4">

                    <p className="text-sm text-slate-500">

                        {filteredUsers.length}{" "}
                        {filteredUsers.length === 1
                            ? "developer"
                            : "developers"
                        } found

                    </p>

                </div>


                {/* Users */}

                {filteredUsers.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="text-4xl">
                            🔎
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            No developers found
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Try searching for a different name, skill, or keyword.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2">

                        {filteredUsers.map((user) => (

                            <div
                                key={user._id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                            >

                                {/* User information */}

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        {/* Avatar */}

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

                                        </div>

                                    </div>

                                </div>


                                {/* Bio */}

                                <p className="mt-5 text-sm leading-6 text-slate-600">
                                    {user.bio || "This developer hasn't added a bio yet."}
                                </p>


                                {/* Skills */}

                                <div className="mt-5">

                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Skills & Interests
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {user.interests?.length ? (

                                            user.interests.map((interest, index) => (

                                                <span
                                                    key={index}
                                                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                                                >
                                                    {interest}
                                                </span>

                                            ))

                                        ) : (

                                            <span className="text-sm text-slate-400">
                                                No skills added
                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* Action */}

                                <div className="mt-6 border-t border-slate-100 pt-5">

                                    {user.connectionStatus === "none" && (

                                        <button
                                            onClick={() => sendRequest(user._id)}
                                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            + Connect
                                        </button>

                                    )}


                                    {user.connectionStatus === "sent" && (

                                        <button
                                            disabled
                                            className="w-full cursor-not-allowed rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500"
                                        >
                                            ✓ Request Sent
                                        </button>

                                    )}


                                    {user.connectionStatus === "received" && (

                                        <button
                                            disabled
                                            className="w-full cursor-not-allowed rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-600"
                                        >
                                            ↗ Request Received
                                        </button>

                                    )}


                                    {user.connectionStatus === "connected" && (

                                        <button
                                            disabled
                                            className="w-full cursor-not-allowed rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-600"
                                        >
                                            ✓ Connected
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

}

export default Discover;