import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FaStar } from "react-icons/fa";
import { fetcher } from "../../utils/api";

export const Route = createFileRoute("/owner/dashboard")({
  component: RouteComponent,
});

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserRating {
  rating: number;
  comment?: string;
  createdAt: string;
  User: User;
}

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  avgRating: number | null;
  Ratings: UserRating[];
}

function RouteComponent() {
  const {
    data: stores,
    isLoading,
    error,
  } = useQuery<Store[]>({
    queryKey: ["ownerStores"],
    queryFn: () => fetcher<Store[]>("/stores/owner"),
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Store Owner Dashboard</h1>

      {isLoading ? (
        <p>Loading store details...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching stores</p>
      ) : stores && stores.length > 0 ? (
        stores.map((store) => (
          <div
            key={store.id}
            className="p-4 bg-white shadow-md rounded-lg mb-6"
          >
            <h2 className="text-2xl font-bold">{store.name}</h2>
            <p className="text-gray-600">{store.address}</p>
            <div className="flex items-center mt-2">
              <span className="font-semibold mr-2">Average Rating:</span>
              <StarRating rating={store.avgRating} />
            </div>

            <h3 className="text-xl font-bold mt-4">User Ratings</h3>
            {store.Ratings.length > 0 ? (
              <ul className="space-y-4">
                {store.Ratings.map((rating, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg bg-gray-100 shadow-md"
                  >
                    <p className="font-bold">
                      {rating.User.name} ({rating.User.email})
                    </p>
                    <div className="flex items-center mt-2">
                      <StarRating rating={rating.rating} />
                    </div>
                    <p className="italic mt-2">
                      "{rating.comment ?? "No Comment"}"
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(rating.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-red-500">You do not own any stores.</p>
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
