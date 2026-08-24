import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/users/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <section className="min-h-screen flex items-center px-8 lg:px-20">

                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

                    <div>

                        <div className="mb-8">
                            <span className="text-2xl font-bold">
                                Idea<span className="text-cyan-400">Match</span>
                            </span>
                        </div>

                        <div className="inline-block border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded-full text-sm mb-6">
                            Find. Connect. Build.
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                            Great ideas.
                            <br />
                            <span className="text-cyan-400">
                                Better people.
                            </span>
                        </h1>

                        <p className="text-slate-300 text-lg mt-6 max-w-xl leading-relaxed">
                            IdeaMatch helps developers, designers and
                            creators find people who actually want to
                            build something instead of just saying
                            "we should totally make an app."
                        </p>

                        <div className="flex gap-8 mt-10 text-sm text-slate-300">

                            <div>
                                <div className="text-2xl mb-2">🤝</div>
                                Find Teammates
                            </div>

                            <div>
                                <div className="text-2xl mb-2">💬</div>
                                Real-time Chat
                            </div>

                            <div>
                                <div className="text-2xl mb-2">🚀</div>
                                Build Together
                            </div>

                        </div>


                    </div>


                    <div className="flex justify-center lg:justify-end">

                        <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl p-8 shadow-2xl">

                            <h2 className="text-3xl font-bold">
                                Welcome back 👋
                            </h2>

                            <p className="text-slate-500 mt-2 mb-8">
                                Log in and get back to building.
                            </p>


                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>

                            <input
                                className="w-full border border-slate-300 p-3 rounded-lg mb-5 outline-none focus:ring-2 focus:ring-cyan-400"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />


                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>

                            <input
                                className="w-full border border-slate-300 p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-cyan-400"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleLogin();
                                    }
                                }}
                            />


                            <button
                                className="w-full bg-slate-950 text-white py-3 rounded-lg font-semibold hover:bg-cyan-500 transition"
                                onClick={handleLogin}
                            >
                                Login
                            </button>


                            <p className="text-center text-slate-500 mt-6">
                                Don't have an account?

                                <Link
                                    to="/signup"
                                    className="text-cyan-500 font-semibold ml-2 hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <section className="bg-white text-slate-900 py-24 px-8">

                <div className="max-w-5xl mx-auto">

                    

                    <p className="text-slate-500 text-lg mt-5">
                        We're here to fix that.
                    </p>


                    <div className="grid md:grid-cols-3 gap-8 mt-14">

                        <div>
                            <div className="text-3xl mb-4">👨‍💻</div>

                            <h3 className="font-bold text-xl">
                                Developers
                            </h3>

                            <p className="text-slate-500 mt-2">
                                You have 47 tabs open.
                                Maybe one of them has your next project.
                            </p>
                        </div>


                        <div>
                            <div className="text-3xl mb-4">🎨</div>

                            <h3 className="font-bold text-xl">
                                Designers
                            </h3>

                            <p className="text-slate-500 mt-2">
                                Great designs deserve someone
                                who can actually build them.
                            </p>
                        </div>


                        <div>
                            <div className="text-3xl mb-4">💡</div>

                            <h3 className="font-bold text-xl">
                                Idea People
                            </h3>

                            <p className="text-slate-500 mt-2">
                                Yes, your idea is probably great.
                                Now find someone to build it.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;