import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../utils/api";

export const Route = createFileRoute("/admin/addStore")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
    createNewOwner: false,
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const { data: users } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["users"],
    queryFn: () => fetcher("/admin/users?role=store_owner"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setForm({ ...form, createNewOwner: !form.createNewOwner, ownerId: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.createNewOwner) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
      if (!passwordRegex.test(form.ownerPassword)) {
        toast.error("Password must be 8-16 characters, include at least one uppercase letter and one special character.");
        return;
      }
    }

    try {
      await fetcher("/stores", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("Store added successfully!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });

      setForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
        createNewOwner: false,
        ownerName: "",
        ownerEmail: "",
        ownerPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add store.");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600 min-h-screen">
      <button
        onClick={() => navigate({ to: "/admin/dashboard" })}
        className="absolute left-4 top-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transform transition duration-300 hover:scale-105"
      >
        Back
      </button>
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">Add New Store</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[{ label: "Store Name", name: "name", type: "text" }, { label: "Store Email", name: "email", type: "email" }, { label: "Store Address", name: "address", type: "text" }].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700" htmlFor={name}>
                {label}
              </label>
              <input
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={type}
                name={name}
                id={name}
                placeholder={label}
                onChange={handleChange}
                value={form[name]}
                required
              />
            </div>
          ))}

          {!form.createNewOwner && (
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700" htmlFor="ownerId">Store Owner</label>
              <select
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="ownerId"
                id="ownerId"
                onChange={handleChange}
                value={form.ownerId}
                disabled={form.createNewOwner}
                required={!form.createNewOwner}
              >
                <option value="">Select Owner</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="createNewOwner"
              checked={form.createNewOwner}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="createNewOwner" className="font-medium text-gray-700">
              Create New Store Owner
            </label>
          </div>

          {form.createNewOwner && (
            <>
              {[{ label: "Owner Name", name: "ownerName", type: "text" }, { label: "Owner Email", name: "ownerEmail", type: "email" }, { label: "Owner Password", name: "ownerPassword", type: "password" }].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type={type}
                    name={name}
                    autoComplete="off"
                    id={name}
                    placeholder={label}
                    onChange={handleChange}
                    value={form[name]}
                    required
                  />
                </div>
              ))}
            </>
          )}

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
}
