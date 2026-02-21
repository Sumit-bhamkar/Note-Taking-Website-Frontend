import { createContext, useEffect, useState } from "react";
import { AUTH_URL } from "../api/url";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    // Restore user info from localStorage on page refresh
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Keep token in localStorage in sync
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Keep user info in localStorage in sync
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await AUTH_URL.post("/register", payload);
      setLoading(false);
      return { success: true, data: res.data };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await AUTH_URL.post("/login", payload);
      // Save token
      setToken(res.data.token);
      Cookies.set("token", res.data.token, { expires: 7 });
      // Save user info (name, email) from the login response
      setUser({ name: res.data.name, email: res.data.email });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
