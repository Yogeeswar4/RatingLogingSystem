import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <nav className="w-full py-4 bg-gradient-to-r from-teal-500 via-blue-400 to-indigo-600 text-white flex justify-between items-center shadow-2xl rounded-lg transform transition-all duration-300 hover:scale-105">
      <div className="flex-1 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-wide transition-all duration-300 ease-in-out transform hover:text-yellow-400 hover:scale-110 text-shadow-md">
          <Link to="/dashboard">Rating Platform</Link>
        </h1>
      </div>

     
      {user && (
        <div className="flex space-x-6">
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 hover:scale-110 transition-all duration-300 transform hover:shadow-lg"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 transform hover:shadow-lg"
            onClick={() => navigate({ to: "/auth/changepassword" })}
          >
            <i className="fas fa-key mr-2"></i> Change Password
          </button>
        </div>
      )}
    </nav>
  );
}
