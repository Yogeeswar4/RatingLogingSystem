import { Link, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserNavbar = () => {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <nav className="p-4 bg-gradient-to-r from-green-600 via-purple-500 to-blue-500 text-white flex justify-between items-center shadow-xl">
     
      <div className="flex-1 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide">
          <Link to="/dashboard" className="hover:text-yellow-300 transition-all">
            Rating Platform
          </Link>
        </h1>
      </div>

      
      {user && (
        <div className="flex space-x-6">
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate({ to: "/auth/changepassword" })}
          >
            Change Password
          </button>
          <button
            className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
