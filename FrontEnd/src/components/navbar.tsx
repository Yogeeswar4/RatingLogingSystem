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
    <nav className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-semibold">
        <Link to="/dashboard">Rating Platform</Link>
      </h1>
      {user && (
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate({ to: "/auth/changepassword" })}
          >
            Change Password
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
