import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetcher } from "../../../utils/api";

interface Store {
  id: number;
  name: string;
  address: string;
  avgRating: number | null;
}

interface UserRating {
  rating: number;
  comment?: string;
}

export const Route = createFileRoute("/dashboard/store/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: storeId } = useParams({ from: "/dashboard/store/$id" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const {
    data: store,
    isLoading,
    error,
  } = useQuery<Store>({
    queryKey: ["store", storeId],
    queryFn: async () => await fetcher<Store>(`/stores/${storeId}`),
  });

  const { data: userRating } = useQuery<UserRating | null>({
    queryKey: ["userRating", storeId],
    queryFn: async () =>
      await fetcher<UserRating | null>(`/rating/${storeId}/user`),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (userRating) {
      setSelectedRating(userRating.rating);
      setComment(userRating.comment ?? "");
    }
  }, [userRating]);

  const submitRating = useMutation({
    mutationFn: async () => {
      await fetcher(`/rating/${storeId}`, {
        method: userRating ? "PUT" : "POST",
        body: JSON.stringify({ rating: selectedRating, comment }),
      });
    },
    onSuccess: () => {
      toast.success(userRating ? "Rating updated!" : "Rating submitted!");
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
      queryClient.invalidateQueries({ queryKey: ["userRating", storeId] });
    },
    onError: () => {
      toast.error("Failed to submit rating.");
    },
  });

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 text-blue-500 cursor-pointer hover:underline"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        ← Back
      </button>
      {isLoading && <p>Loading store...</p>}
      {error && <p className="text-red-500">Error loading store</p>}
      {!isLoading && !error && store && (
        <>
          <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
          <p className="text-gray-600 mb-4">{store.address}</p>

          <div className="flex items-center mt-4">
            <span className="font-semibold mr-2">Overall Rating:</span>
            <StarRating rating={store.avgRating} />
          </div>

          {userRating && (
            <div className="mt-4">
              <span className="font-semibold">Your Rating:</span>
              <StarRating rating={userRating.rating} />
              <p className="text-gray-500 italic mt-1">
                "{userRating.comment}"
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              {userRating ? "Update Your Rating" : "Rate This Store"}
            </h2>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  className={`cursor-pointer text-2xl ${
                    value <= (selectedRating ?? 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setSelectedRating(value)}
                />
              ))}
            </div>
            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Leave a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              disabled={!selectedRating}
              onClick={() => submitRating.mutate()}
            >
              {userRating ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const StarRating: React.FC<{ rating: number | null }> = ({ rating }) => {
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);

  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index + 1}
          className={index < fullStars ? "" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-gray-600">
        {validRating ? validRating.toFixed(1) : "No ratings yet"}
      </span>
    </div>
  );
};
