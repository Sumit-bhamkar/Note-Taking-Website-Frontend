import { createContext, useEffect, useState } from "react";
import { AUTH_URL } from "../api/url";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

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
      setToken(res.data.token);
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
