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
  console.log(user);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <button
        onClick={() => navigate({ to: "/admin/dashboard" })}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
      <div className="p-6 w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          {user ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
              <div className="mb-2">
                <strong className="block text-gray-700">Email:</strong>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="mb-2">
                <strong className="block text-gray-700">Address:</strong>
                <span className="text-gray-900">{user.address}</span>
              </div>
              <div className="mb-2">
                <strong className="block text-gray-700">Role:</strong>
                <span className="text-gray-900">{user.role}</span>
              </div>

              {user.role === "store_owner" &&
                user.stores &&
                user.stores.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-2">Owned Stores</h2>
                    <ul className="space-y-4">
                      {user.stores.map((store) => (
                        <li
                          key={store.id}
                          className="p-4 border rounded-lg bg-gray-100 shadow-md"
                        >
                          <p className="font-bold">{store.name}</p>
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

              {user.role === "store_owner" &&
                (!user.stores || user.stores.length === 0) && (
                  <p className="text-gray-500 mt-4">No stores owned.</p>
                )}
            </>
          ) : (
            <p className="text-center text-gray-500">No user data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
