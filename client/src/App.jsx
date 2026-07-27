import { Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Connections from "./pages/Connections";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

               <Route
                   path="/dashboard"
                   element={
                  <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

            <Route path="/profile" element={<Profile />} />

            <Route path="/discover" element={<Discover />} />

            <Route path="/connections" element={<Connections />} />

            <Route path="/chat" element={<Chat />} />

        </Routes>
    );
}

export default App;