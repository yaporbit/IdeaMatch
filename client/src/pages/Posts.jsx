import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts");
            setPosts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const createPost = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/posts",
                {
                    content
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setContent("");
            fetchPosts();
        } catch (error) {
            console.log(error);
            alert("Could not create post");
        }
    };

    const sendInterest = async (userId) => {
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
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-8">

                <h1 className="text-3xl font-bold mb-2">
                    Community
                </h1>

                <p className="text-gray-500 mb-6">
                    Find people to build, collaborate and create with.
                </p>

                <form
                    onSubmit={createPost}
                    className="bg-white border rounded-xl p-5 mb-8 shadow-sm"
                >
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Looking for teammates? Want to build something together?"
                        className="w-full border rounded-lg p-3 h-28 resize-none outline-none"
                    />

                    <button
                        type="submit"
                        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Post
                    </button>
                </form>

                <div className="space-y-5">

                    {posts.length === 0 && (
                        <p className="text-gray-500">
                            No posts yet. Be the first one 👀
                        </p>
                    )}

                    {posts.map((post) => (

                        <div
                            key={post._id}
                            className="bg-white border rounded-xl p-5 shadow-sm"
                        >

                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {post.author.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {post.author.bio || "Developer"}
                                    </p>
                                </div>

                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                            <p className="mt-4 text-gray-800">
                                {post.content}
                            </p>

                            <button
                                onClick={() =>
                                    sendInterest(post.author._id)
                                }
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Interested
                            </button>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}

export default Posts;