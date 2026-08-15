import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Connections from "./pages/Connections";
import Chat from "./pages/Chat";
import PendingRequests from "./pages/PendingRequests";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/discover"
                element={
                    <ProtectedRoute>
                        <Discover />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/connections"
                element={
                    <ProtectedRoute>
                        <Connections />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/chat/:userId"
                element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pending"
                element={
                    <ProtectedRoute>
                        <PendingRequests />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;