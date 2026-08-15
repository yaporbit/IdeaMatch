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

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Sign Up
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-3"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-3"
                />

                <input
                    type="text"
                    name="bio"
                    placeholder="Bio"
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-3"
                />

                <input
                    type="text"
                    name="interests"
                    placeholder="React, Node, Java"
                    onChange={handleChange}
                    className="w-full border p-3 rounded mb-6"
                />

                <button
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    Create Account
                </button>

                <p className="text-center mt-4">

                    Already have an account?

                    <Link
                        to="/"
                        className="text-blue-600 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Signup;