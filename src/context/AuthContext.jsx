import { createContext, useEffect, useState } from "react";
import { AUTH_URL } from "../api/url";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* =========================
     SAVE TOKEN TO LOCALSTORAGE
  ========================= */
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /* =========================
     REGISTER
  ========================= */
  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await AUTH_URL.post("/register", payload);
      return res.data;
    }
  });

  const register = async (payload) => {
    try {
      const data = await registerMutation.mutateAsync(payload);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  };

  /* =========================
     LOGIN
  ========================= */
  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await AUTH_URL.post("/login", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
    }
  });

  const login = async (payload) => {
    try {
      await loginMutation.mutateAsync(payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading: loginMutation.isPending || registerMutation.isPending,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};