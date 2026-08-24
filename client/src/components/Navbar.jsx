
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                <Link
                    to="/dashboard"
                    className="text-2xl font-bold tracking-tight"
                >
                    <span className="text-blue-600">Idea</span>
                    <span className="text-slate-800">Match</span>
                    <span className="ml-1">✓</span>
                </Link>

                <div className="flex items-center gap-7">

                    <Link
                        to="/dashboard"
                        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/discover"
                        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Discover
                    </Link>

                    <Link
                        to="/connections"
                        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Connections
                    </Link>

                    <Link
                        to="/pending"
                        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        Requests
                    </Link>

                    <button
                        onClick={logout}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;