import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const { data } = await api.get("/users/profile");
      saveUser(data);
    } catch (error) {
      localStorage.removeItem("rafiki_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const saveUser = (userData) => {
    localStorage.setItem("rafiki_user", JSON.stringify(userData));
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/users/profile");
      saveUser(data);
    } catch (error) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      saveUser(data);
      toast.success("Logged in successfully!");
      return data; // Return user data for redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return null; // Return null on failure
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
      saveUser(data);
      toast.success("Registered successfully!");
      return data; // Return user data for redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("rafiki_user");
      setUser(null);
      toast.success("Logged out");
    }
  };

  // --- NEW FUNCTION ---
  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    const isCurrentlyFavorited = user.favorites.some(
      (fav) => (fav._id || fav) === productId
    );
    let updatedFavorites;

    // Optimistic UI update
    if (isCurrentlyFavorited) {
      updatedFavorites = user.favorites.filter(
        (fav) => (fav._id || fav) !== productId
      );
    } else {
      updatedFavorites = [...user.favorites, { _id: productId }]; // Add a placeholder
    }

    setUser((currentUser) => ({
      ...currentUser,
      favorites: updatedFavorites,
    }));

    try {
      // Send request to backend
      const { data } = await api.put("/users/profile/favorites", { productId });
      // Sync state with the populated list from the backend
      saveUser({ ...user, favorites: data });
      toast.success(
        isCurrentlyFavorited ? "Removed from favorites" : "Added to favorites!"
      );
    } catch (err) {
      // Revert on error
      toast.error("Failed to update favorites.");
      setUser((currentUser) => ({
        ...currentUser,
        favorites: user.favorites, // Revert to original
      }));
    }
  };

  // --- NEW FUNCTION FOR GOOGLE ---
  const handleGoogleLogin = async (googleCredential) => {
    try {
      // Send the credential to our backend
      const { data } = await api.post("/users/auth/google", {
        credential: googleCredential,
      });

      saveUser(data); // Save user, backend sets cookie
      toast.success("Logged in with Google!");
      return data; // Return user for redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        refreshUser,
        loading,
        toggleFavorite,
        handleGoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
