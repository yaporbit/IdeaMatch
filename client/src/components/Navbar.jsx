
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {

    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

    fetchNotifications();

}, []);

const fetchNotifications = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await api.get(
            "/users/notifications",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setNotifications(res.data);

    } catch (error) {

        console.log(error);

    }

};

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <nav className="border-b bg-white">

            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                {/* Logo */}

                <Link
                    to="/dashboard"
                    className="text-2xl font-bold text-blue-600"
                >
                    Idea✅
                </Link>


                {/* Navigation */}

                <div className="flex items-center gap-6">

                    <Link
                        to="/dashboard"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/discover"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Discover
                    </Link>

                    <Link
                        to="/connections"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Connections
                    </Link>

                    <Link
                        to="/pending"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Requests
                    </Link>

                   <Link
                   to="/pending"
                 className="text-gray-600 transition hover:text-blue-600"
                   >
                  🔔 {notifications.length}
                  </Link>


                    {/* Logout */}

                    <button
                        onClick={logout}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;