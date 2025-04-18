import { createFileRoute } from "@tanstack/react-router";
import { fetcher } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import UserList from "../../components/UserList";
import StoreList from "../../components/StoreList";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

function RouteComponent() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats>({
    queryKey: ["adminStats"],
    queryFn: () => fetcher<DashboardStats>("/admin/dashboard"),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-8 rounded-xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers} />
              <StatCard title="Total Stores" value={stats.totalStores} />
              <StatCard title="Total Ratings" value={stats.totalRatings} />
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Users & Stores</h2>
            <UserList />
            <StoreList />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  readonly title: string;
  readonly value: number;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg opacity-20"></div>
        <p className="text-4xl font-extrabold text-indigo-700 z-10">{value}</p>
      </div>

      <div className="mt-4 flex justify-center items-center">
        <span className="text-gray-500">★</span>
        <div className="relative flex items-center">
          <div className="w-1/2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-md"></div>
          <div className="absolute w-1/2 h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
        </div>
        <span className="text-gray-500">★</span>
      </div>

     
    </div>
  );
}
