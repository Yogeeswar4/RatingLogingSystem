import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/api";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export default function UserList() {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users", filters],
    queryFn: () =>
      fetcher<User[]>(
        `/admin/users?name=${filters.name}&email=${filters.email}&address=${filters.address}&role=${filters.role}`
      ),
  });

  return (
    <div className="mt-6 p-8 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-200 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <h2 className="text-3xl font-bold mb-6">Users</h2>

      {/* Filters */}
      <div className="flex gap-6 mb-8">
        <input
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-xl transition-all"
          placeholder="Search by Name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-xl transition-all"
          placeholder="Search by Email"
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-xl transition-all"
          placeholder="Search by Address"
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <select
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-xl transition-all"
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error.message}</p>}

      {/* Users Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.length ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <td className="border p-2">
                  <Link
                    to={`/admin/user/$userid`.replace(
                      "$userid",
                      user.id.toString()
                    )}
                    className="text-blue-500 hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.address}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
