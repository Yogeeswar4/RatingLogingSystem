import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { fetcher } from "../../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

export const Route = createFileRoute("/auth/changepassword")({
  component: RouteComponent,
});

function RouteComponent() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(password);
  };

  const changePassword = useMutation({
    mutationFn: async () => {
      await fetcher("/auth/changepassword", {
        method: "PUT",
        body: JSON.stringify(form),
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "" });
      if (user?.role === "user") {
        navigate({ to: "/dashboard" });
      } else if (user?.role === "store_owner") {
        navigate({ to: "/owner/dashboard" });
      } else {
        navigate({ to: "/admin/dashboard" });
      }
    },
    onError: () => {
      toast.error("Failed to change password.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.oldPassword === form.newPassword) {
      toast.error("New password cannot be the same as the old password.");
      return;
    }
    if (!validatePassword(form.newPassword)) {
      toast.error(
        "Password must be 8-16 characters long, include at least one uppercase letter and one special character."
      );
      return;
    }
    changePassword.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
     
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-teal-600 to-blue-700 opacity-20"></div>
      </div>

      
      <div className="absolute top-5 left-0 right-0 z-10 text-center text-white text-xl font-semibold opacity-90">
        <p className="text-2xl">⭐ Rate our platform ⭐</p>
        <div className="flex justify-center mt-3 text-yellow-300 space-x-2">
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
        </div>
      </div>

      
      <div className="absolute top-20 left-0 right-0 z-10 text-center text-white opacity-80">
       
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/355/389/non_2x/five-5-star-rank-sign-illustration-free-vector.jpg"
          alt="Chocolate covered 5-star rating"
          className="mx-auto mt-4 rounded-xl shadow-lg"
        />
          </div>
      
     

      
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl z-10">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          Change Password
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="oldPassword" className="block font-medium">
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              className="input border rounded p-2 w-full"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block font-medium">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="input border rounded p-2 w-full"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform cursor-pointer"
          >
            Change Password
            <div className="cursor-effect"></div>
          </button>
        </form>
      </div>
    </div>
  );
}
