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
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl">
        <Link to="/owner/dashboard">Rating App</Link>
      </h1>
      {user && (
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate({ to: "/auth/changepassword" })}
          >
            Change Password
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded cursor-pointer"
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
