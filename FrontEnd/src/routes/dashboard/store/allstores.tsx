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

  const {
    data: stores,
    isLoading,
    error,
  } = useQuery<
    {
      id: string;
      name: string;
      address: string;
      avgRating: number | null;
      userRating?: number | null;
    }[]
  >({
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
    <div className="p-6">
      <h1 className="text-3xl font-bold">All Stores</h1>
      <button
        className="mb-4 text-blue-500 cursor-pointer hover:underline"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        ← Back to Dashboard
      </button>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="border p-2 rounded w-full"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Address"
          className="border p-2 rounded w-full"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <select
          className="border p-2 rounded w-full"
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

      {isLoading && <p>Loading stores...</p>}
      {error && <p className="text-red-500">Error loading stores</p>}

      {(filteredStores?.length ?? 0 > 0) ? (
        <ul className="mt-6 space-y-4">
          {filteredStores?.map((store) => (
            <li
              key={store.id}
              className="p-4 border rounded-lg bg-gray-100 shadow-md relative"
            >
              <p className="font-bold text-lg">{store.name}</p>
              <p className="text-gray-600">{store.address}</p>

              <div className="flex items-center mt-2">
                <span className="font-semibold">Overall Rating:</span>
                <StarRating rating={store.avgRating} />
              </div>

              {store.userRating !== null && store.userRating !== undefined && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" /> Rated
                </span>
              )}

              <button
                className={`mt-2 px-3 py-1 rounded-lg transition ${
                  store.userRating !== null
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
                onClick={() => navigate({ to: `/dashboard/store/${store.id}` })}
              >
                {store.userRating !== null
                  ? "Edit Rating"
                  : "View & Rate Store"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stores found</p>
      )}
    </div>
  );
}

function StarRating({ rating }: { readonly rating: number | null }) {
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);

  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < fullStars ? "" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-gray-600">
        {validRating ? validRating.toFixed(1) : "No ratings yet"}
      </span>
    </div>
  );
}
