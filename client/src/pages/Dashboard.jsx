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

    <div>

        <Navbar />

        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="mx-auto max-w-4xl">

                <h1 className="text-4xl font-bold text-gray-900">
                    Welcome {user.name} 👋
                </h1>

                <p className="mt-2 text-gray-500">
                    Welcome back to IdeaMatch.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-6 shadow-sm border">
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="mt-2 font-medium text-gray-900">
                            {user.email}
                        </p>
                    </div>


                    <div className="rounded-xl bg-white p-6 shadow-sm border">
                        <p className="text-sm text-gray-500">
                            Bio
                        </p>

                        <p className="mt-2 text-gray-900">
                            {user.bio || "No bio added yet."}
                        </p>
                    </div>


                    <div className="rounded-xl bg-white p-6 shadow-sm border">
                        <p className="text-sm text-gray-500">
                            Skills
                        </p>

                        <p className="mt-2 text-gray-900">
                            {user.interests?.length
                                ? user.interests.join(", ")
                                : "No skills added yet."}
                        </p>
                    </div>

                </div>

            </div>

        </div>

    </div>

);

}

export default Dashboard;