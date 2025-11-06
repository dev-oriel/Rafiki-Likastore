import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="grow container mx-auto p-4">
        {/* Outlet renders the active page (HomePage, LoginPage, etc.) */}
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        Copyright &copy; Rafiki Likastore 2025
      </footer>
    </div>
  );
};

export default App;
