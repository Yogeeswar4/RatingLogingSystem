import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/api";
import { useState } from "react";

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  avgRating: number | null;
}

export default function StoreList() {
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sort, setSort] = useState("desc");

  const {
    data: stores,
    isLoading,
    error,
  } = useQuery<Store[]>({
    queryKey: ["stores", filters, sort],
    queryFn: () =>
      fetcher<Store[]>(
        `/stores?name=${filters.name}&email=${filters.email}&address=${filters.address}&sort=${sort}`
      ),
  });

  return (
    <div className="mt-6 p-8 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-200 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Stores</h2>

     
      <div className="flex gap-6 mb-8 justify-center">
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
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="desc">Highest Rating</option>
          <option value="asc">Lowest Rating</option>
        </select>
      </div>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {error && (
        <p className="text-center text-red-500 font-semibold">Error: {error.message}</p>
      )}

      
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores?.map((store) => {
            const rating = Number(store.avgRating);
            return (
              <tr
                key={store.id}
                className="border-b hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <td className="border p-2">{store.name}</td>
                <td className="border p-2">{store.email}</td>
                <td className="border p-2">{store.address}</td>
                <td className="border p-2">
                  {isNaN(rating) || rating === 0
                    ? "No ratings yet"
                    : rating.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
