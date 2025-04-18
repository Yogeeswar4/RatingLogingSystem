import { createFileRoute } from "@tanstack/react-router";
import { fetcher } from "../../utils/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/admin/addUser")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("User added successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {[{ label: "Full Name", name: "name", type: "text" }, { label: "Email", name: "email", type: "email" }, { label: "Password", name: "password", type: "password" }, { label: "Address", name: "address", type: "text" }].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700" htmlFor={name}>
              {label}
            </label>
            <input
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={type}
              name={name}
              id={name}
              autoComplete="off"
              placeholder={label}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700" htmlFor="role">
            Role
          </label>
          <select
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="role"
            id="role"
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-300">
          Add User
        </button>
      </form>
    </div>
  );
}
