import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Add loading state

  // 2. This function checks if the cookie is valid on app load
  const checkUserStatus = async () => {
    try {
      // api.js now sends the cookie
      const { data } = await api.get("/users/profile");
      saveUser(data); // Save valid user to state
    } catch (error) {
      // No valid cookie, so we are logged out
      localStorage.removeItem("rafiki_user");
      setUser(null);
    } finally {
      // We are done checking
      setLoading(false);
    }
  };

  // 3. Run the check only once when the app first loads
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Helper to set user in state and local storage
  const saveUser = (userData) => {
    localStorage.setItem("rafiki_user", JSON.stringify(userData));
    setUser(userData);
  };

  // This is the function your ProfileSidebar will call
  const refreshUser = async () => {
    // This is the same as checkUserStatus, but we don't set loading
    try {
      const { data } = await api.get("/users/profile");
      saveUser(data);
    } catch (error) {
      // If this fails, the cookie is bad, so log them out
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      saveUser(data); // Backend sets cookie, we save user data
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password, phone, dob) => {
    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
        phone,
        dob,
      });
      saveUser(data); // Backend sets cookie, we save user data
      toast.success("Registered successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout"); // Tell backend to clear cookie
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Always clear frontend state
      localStorage.removeItem("rafiki_user");
      setUser(null);
      toast.success("Logged out");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, refreshUser, loading }}
    >
      {/* 4. Pass 'loading' to all children */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
