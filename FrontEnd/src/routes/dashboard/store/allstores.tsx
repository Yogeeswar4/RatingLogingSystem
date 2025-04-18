import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fetcher } from "../../../utils/api";
import { FaStar, FaCheckCircle } from "react-icons/fa";

export const Route = createFileRoute("/dashboard/store/allstores")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    name: "",
    address: "",
    rating: "",
  });

  const { data: stores, isLoading, error } = useQuery<{
    id: string;
    name: string;
    address: string;
    avgRating: number | null;
    userRating?: number | null;
  }[]>({
    queryKey: ["stores"],
    queryFn: () => fetcher("/stores"),
  });

  const filteredStores = stores?.filter((store) => {
    const matchesName = store.name
      .toLowerCase()
      .includes(search.name.toLowerCase());
    const matchesAddress = store.address
      .toLowerCase()
      .includes(search.address.toLowerCase());
    const matchesRating =
      search.rating === "" || (store.avgRating ?? 0) >= Number(search.rating);

    return matchesName && matchesAddress && matchesRating;
  });

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
        All Stores
      </h1>
      
     
      <button
        className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer flex items-center"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        ← Back to Dashboard
      </button>

      {/* Search Filters */}
      <div className="flex gap-6 mb-8">
        <input
          type="text"
          placeholder="Search by Name"
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Address"
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <select
          className="border p-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
          value={search.rating}
          onChange={(e) => setSearch({ ...search, rating: e.target.value })}
        >
          <option value="">All Ratings</option>
          <option value="1">1★ & Above</option>
          <option value="2">2★ & Above</option>
          <option value="3">3★ & Above</option>
          <option value="4">4★ & Above</option>
          <option value="5">5★ Only</option>
        </select>
      </div>

      {/* Loading and Error Handling */}
      {isLoading && <p className="text-center text-gray-600">Loading stores...</p>}
      {error && <p className="text-center text-red-500 font-semibold">Error loading stores</p>}

    
      {filteredStores?.length ? (
        <ul className="space-y-6">
          {filteredStores.map((store) => (
            <li
              key={store.id}
              className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
            >
              <p className="font-semibold text-lg text-gray-800">{store.name}</p>
              <p className="text-gray-600">{store.address}</p>
              <div className="flex items-center mt-3">
                <span className="font-semibold">Overall Rating:</span>
                <StarRating rating={store.avgRating} />
              </div>

              
              {store.userRating !== null && store.userRating !== undefined && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" /> Rated
                </span>
              )}

            
              <button
                className={`mt-4 px-6 py-3 rounded-lg transition-all duration-300 transform ${
                  store.userRating !== null
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:bg-gradient-to-l text-white"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-gradient-to-l text-white"
                }`}
                onClick={() => navigate({ to: `/dashboard/store/${store.id}` })}
              >
                {store.userRating !== null ? "Edit Rating" : "View & Rate Store"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No stores found</p>
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);

  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, index) => (
        <FaStar key={index} className={index < fullStars ? "" : "text-gray-300"} />
      ))}
      <span className="ml-2 text-gray-600">{validRating ? validRating.toFixed(1) : "No ratings yet"}</span>
    </div>
  );
}
