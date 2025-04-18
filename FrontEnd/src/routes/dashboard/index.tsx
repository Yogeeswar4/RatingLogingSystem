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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300 bg-cover">
      <div className="p-12 bg-white rounded-xl shadow-2xl w-full max-w-6xl transform transition-all duration-500 hover:scale-105">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
          Welcome, {userData?.name ?? "Guest"}!
        </h1>

        {user && (
          <div className="mt-12">
           
            <div className="flex justify-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-700">
                Rate These Stores ⭐
              </h2>
            </div>

            {/* Loading & Error Handling */}
            {isLoading && (
              <p className="text-center text-gray-600 animate-pulse">Loading stores...</p>
            )}
            {error && (
              <p className="text-center text-red-500 font-semibold">Error loading stores</p>
            )}

            {/* Stores List */}
            {stores && stores.length > 0 ? (
              <ul className="space-y-8">
                {stores.map((store) => (
                  <li
                    key={store.id}
                    className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <p className="font-bold text-xl text-gray-800">{store.name}</p>
                    <p className="text-gray-600">{store.address}</p>
                    <div className="flex items-center mt-4">
                      <RatingStars rating={store.avgRating} />
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 hover:scale-105 transition-all ease-in-out transform"
                        onClick={() =>
                          navigate({
                            to: "/dashboard/store/$id".replace("$id", store.id),
                          })
                        }
                      >
                        Rate This Store
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600"></p>
            )}

            {/* View All Stores Button */}
            <div className="flex justify-center mt-8">
  <button
    type="submit"
    className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-red-500 hover:via-yellow-500 hover:to-blue-500 transition-all duration-300 ease-in-out transform cursor-pointer"
    onClick={() => navigate({ to: "/dashboard/store/allstores" })}
  >
    View All Stores
  </button>
</div>


          </div>
        )}
      </div>
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
          return (
            <FaStar key={key} className="animate-pulse text-yellow-400 transition-all duration-500 transform hover:text-yellow-500" />
          );
        } else if (hasHalfStar && index === fullStars) {
          return <FaRegStar key={key} className="text-yellow-300 transition-all duration-500 transform hover:text-yellow-400" />;
        } else {
          return <FaRegStar key={key} className="text-gray-300 transition-all duration-500 transform hover:text-yellow-300" />;
        }
      })}
      <span className="ml-2 text-gray-700 text-lg font-semibold">{rating ? rating.toFixed(1) : "No ratings"}</span>
    </div>
  );
}
