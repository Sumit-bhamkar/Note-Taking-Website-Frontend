import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">

        {/* Left — Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-400" />
          <span className="text-2xl text-blue-400 tracking-wide">
            NoteKeeper
          </span>
        </Link>

        {/* Center — Greeting (only when logged in) */}
        <div className="hidden sm:flex items-center">
          {token && user?.name && (
            <span className="text-gray-300 text-sm font-medium">
              Hey,{" "}
              <span className="text-blue-400 font-semibold">{user.name}</span>{" "}
              👋
            </span>
          )}
        </div>

        {/* Right — Nav Links */}
        <div className="space-x-6 flex items-center">
          <Link
            to="/"
            className={`hover:text-blue-400 transition ${location.pathname === "/" ? "text-blue-400 font-semibold" : "text-gray-300"
              }`}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`hover:text-blue-400 transition ${location.pathname === "/create" ? "text-blue-400 font-semibold" : "text-gray-300"
              }`}
          >
            Create Note
          </Link>

          {/* Auth Buttons */}
          {token ? (
            <button
              onClick={logout}
              className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="ml-4 hover:text-blue-400 text-gray-300">
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-3 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
