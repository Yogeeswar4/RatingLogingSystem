import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils/api";
import { FaStar, FaRegStar } from "react-icons/fa";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useContext(AuthContext)!;
  const { data: userData } = useQuery<{ name: string }>({
    queryKey: ["user", user?.id],
    queryFn: () => fetcher(`/auth/profile`),
    enabled: !!user?.id,
  });

  const {
    data: stores,
    isLoading,
    error,
  } = useQuery<
    { id: string; name: string; address: string; avgRating: number | null }[]
  >({
    queryKey: ["unratedStores"],
    queryFn: () => fetcher("/stores/unrated?limit=5"),
  });

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {userData?.name ?? "Guest"}!
      </h1>

      {user && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Help Rate These Stores</h2>
          {isLoading && <p>Loading stores...</p>}
          {error && <p className="text-red-500">Error loading stores</p>}
          {stores && stores.length > 0 ? (
            <ul className="space-y-4">
              {stores.map((store) => (
                <li
                  key={store.id}
                  className="p-4 border rounded-lg bg-gray-100 shadow-md"
                >
                  <p className="font-bold text-lg">{store.name}</p>
                  <p className="text-gray-600">{store.address}</p>
                  <div className="flex items-center mt-2">
                    <RatingStars rating={store.avgRating} />
                  </div>
                  <button
                    className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    onClick={() =>
                      navigate({
                        to: "/dashboard/store/$id".replace("$id", store.id),
                      })
                    }
                  >
                    Rate This Store
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>All stores have been rated! 🎉</p>
          )}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate({ to: "/dashboard/store/allstores" })}
          >
            See All Stores
          </button>
        </div>
      )}
    </div>
  );
}

function RatingStars({ rating }: { readonly rating: number | null }) {
  const fullStars = Math.floor(rating ?? 0);
  const hasHalfStar = (rating ?? 0) % 1 !== 0;

  return (
    <div className="flex items-center text-yellow-500">
      {[...Array(5)].map((_, index) => {
        const key = `star-${index}`;
        if (index < fullStars) {
          return <FaStar key={key} className="animate-pulse" />;
        } else if (hasHalfStar && index === fullStars) {
          return <FaRegStar key={key} />;
        } else {
          return <FaRegStar key={key} className="text-gray-300" />;
        }
      })}
      <span className="ml-2 text-gray-600">
        {rating ? rating.toFixed(1) : "No ratings"}
      </span>
    </div>
  );
}
