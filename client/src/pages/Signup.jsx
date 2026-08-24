import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        interests: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/users/signup", {
                ...formData,
                interests: formData.interests
                    .split(",")
                    .map((item) => item.trim())
            });

            alert("Account created!");

            navigate("/");

        } catch (error) {

            console.log(error);

            alert("Signup failed");

        }

    };

    return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

        <div className="w-full max-w-md">

            <div className="text-center mb-8">

                <h1 className="text-4xl font-bold text-white">
                    Idea<span className="text-violet-400">Match</span>
                </h1>

                <p className="text-slate-400 mt-2">
                    Find people who actually want to build things.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl"
            >

                <h2 className="text-2xl font-semibold text-white mb-1">
                    Create your account
                </h2>

                <p className="text-slate-400 text-sm mb-6">
                    Your next project partner might be one signup away.
                </p>


                <div className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg outline-none focus:border-violet-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg outline-none focus:border-violet-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg outline-none focus:border-violet-500"
                    />

                    <input
                        type="text"
                        name="bio"
                        placeholder="A short bio"
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg outline-none focus:border-violet-500"
                    />

                    <input
                        type="text"
                        name="interests"
                        placeholder="Interests: React, Node, Java"
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg outline-none focus:border-violet-500"
                    />

                </div>


                <button
                    type="submit"
                    className="w-full mt-6 bg-violet-600 hover:bg-violet-500 text-white font-semibold p-3 rounded-lg transition"
                >
                    Create Account
                </button>


                <p className="text-center text-slate-400 text-sm mt-6">

                    Already have an account?

                    <Link
                        to="/"
                        className="text-violet-400 hover:text-violet-300 ml-2 font-medium"
                    >
                        Login
                    </Link>

                </p>

            </form>

            <p className="text-center text-slate-600 text-xs mt-6">
                Build something. Find someone. Ship it.
            </p>

        </div>

    </div>

);
}

export default Signup;