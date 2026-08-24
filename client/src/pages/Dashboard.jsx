import Navbar from "../components/Navbar";

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


<h1 className="text-4xl font-bold text-blue-600">
    Tailwind is working!
</h1>



   return (

    <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-12">

            <div className="mb-10">

                <p className="mb-2 text-sm font-semibold text-blue-600">
                    YOUR WORKSPACE
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Welcome, {user.name} 👋
                </h1>

                <p className="mt-2 text-slate-500">
                    Find people. Build ideas. Create something awesome.
                </p>

            </div>


            <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                    <p className="text-sm font-medium text-slate-500">
                        Email
                    </p>

                    <p className="mt-3 text-lg font-semibold text-slate-900">
                        {user.email}
                    </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                    <p className="text-sm font-medium text-slate-500">
                        Bio
                    </p>

                    <p className="mt-3 text-lg font-semibold text-slate-900">
                        {user.bio || "No bio added yet."}
                    </p>

                </div>


                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                    <p className="text-sm font-medium text-slate-500">
                        Skills
                    </p>

                    <p className="mt-3 text-lg font-semibold text-slate-900">
                        {user.interests?.length
                            ? user.interests.join(", ")
                            : "No skills added yet."
                        }
                    </p>

                </div>

            </div>


            <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                    IdeaMatch
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                    Great ideas are useless without the right people.
                </h2>

                <p className="mt-2 max-w-2xl text-blue-100">
                    Discover developers, connect with people who share your
                    interests, and turn random ideas into actual projects.
                </p>

            </div>

        </main>

    </div>

);
}

export default Dashboard;