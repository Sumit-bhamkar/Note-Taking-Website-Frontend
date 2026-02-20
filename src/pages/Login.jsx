import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login({ email, password });
    if (res.success) {
      navigate("/");
    } else {
      setError(res.error?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 mt-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-300">Welcome back</h2>

      {error && <div className="bg-red-600 p-2 rounded mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded text-white font-semibold"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400">
        Don't have an account? <Link to="/register" className="text-blue-300">Register</Link>
      </p>
    </div>
  );
}
