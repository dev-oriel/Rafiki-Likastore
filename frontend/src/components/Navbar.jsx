import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Rafiki Likastore
        </Link>
        <div className="space-x-4">
          <Link to="/cart" className="text-gray-700 hover:text-green-600">
            Cart
          </Link>
          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-green-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
