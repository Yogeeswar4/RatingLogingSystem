import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { fetcher } from "../../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

export const Route = createFileRoute("/auth/changepassword")({
  component: RouteComponent,
});

function RouteComponent() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth/login" });
    }
  });
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
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
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
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
