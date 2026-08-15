import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setName(res.data.name || "");
            setBio(res.data.bio || "");
            setInterests(
                res.data.interests
                    ? res.data.interests.join(", ")
                    : ""
            );

        } catch (error) {

            console.log(error);

        }

    };

    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.put(
                "/users/profile",
                {
                    name,
                    bio,
                    interests: interests
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item !== "")
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Profile updated successfully!");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        }

    };

    return (

        <div>

            <Navbar />

            <div style={{ padding: "20px" }}>

                <h1>My Profile</h1>

                <form onSubmit={updateProfile}>

                    <div>
                        <label>Name</label>

                        <br />

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <br />

                    <div>
                        <label>Bio</label>

                        <br />

                        <textarea
                            value={bio}
                            onChange={(e) =>
                                setBio(e.target.value)
                            }
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <br />

                    <div>
                        <label>Skills / Interests</label>

                        <br />

                        <input
                            type="text"
                            value={interests}
                            onChange={(e) =>
                                setInterests(e.target.value)
                            }
                            placeholder="React, Java, MongoDB, Node.js"
                        />

                        <p>
                            Separate skills with commas.
                        </p>
                    </div>

                    <button type="submit">
                        Save Profile
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Profile;