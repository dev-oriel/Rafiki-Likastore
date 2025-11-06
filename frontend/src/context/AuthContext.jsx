import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("rafiki_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Helper to set user in state and local storage
  const saveUser = (userData) => {
    localStorage.setItem("rafiki_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      saveUser(data);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
        phone,
      });
      saveUser(data);
      toast.success("Registered successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("rafiki_user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
