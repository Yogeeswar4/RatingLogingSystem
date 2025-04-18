import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { fetcher } from "../../../utils/api";

export const Route = createFileRoute("/admin/user/$userid")({
  component: RouteComponent,
});

interface Store {
  id: number;
  name: string;
  address: string;
  avgRating: number | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: "admin" | "user" | "store_owner";
  stores?: Store[];
}

function RouteComponent() {
  const { userid } = useParams({ strict: false });
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user", userid],
    queryFn: () => fetcher<User>(`/admin/users/${userid}`),
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600">
      <button
        onClick={() => navigate({ to: "/admin/dashboard" })}
        className="absolute top-4 left-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transform transition duration-300 hover:scale-105"
      >
        Back
      </button>
      <div className="p-8 w-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
        {user ? (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">{user.name}</h1>
            <div className="mb-4">
              <strong className="block text-gray-700">Email:</strong>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="mb-4">
              <strong className="block text-gray-700">Address:</strong>
              <span className="text-gray-900">{user.address}</span>
            </div>
            <div className="mb-4">
              <strong className="block text-gray-700">Role:</strong>
              <span className="text-gray-900">{user.role}</span>
            </div>

            {user.role === "store_owner" && user.stores && user.stores.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Owned Stores</h2>
                <ul className="space-y-4">
                  {user.stores.map((store) => (
                    <li
                      key={store.id}
                      className="p-4 border rounded-lg bg-gray-100 shadow-md hover:scale-105 transform transition-all duration-300"
                    >
                      <p className="font-semibold text-gray-800">{store.name}</p>
                      <p className="text-gray-600">{store.address}</p>
                      <p className="text-gray-700">
                        <strong>Average Rating:</strong>{" "}
                        {store.avgRating !== null &&
                        !isNaN(Number(store.avgRating))
                          ? Number(store.avgRating).toFixed(1)
                          : "No ratings yet"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.role === "store_owner" && (!user.stores || user.stores.length === 0) && (
              <p className="text-gray-500 mt-4 text-center">No stores owned.</p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No user data available</p>
        )}
      </div>
    </div>
  );
}
