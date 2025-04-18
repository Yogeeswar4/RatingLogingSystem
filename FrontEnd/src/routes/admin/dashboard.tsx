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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Total Stores" value={stats.totalStores} />
          <StatCard title="Total Ratings" value={stats.totalRatings} />
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Manage Users & Stores</h2>
        <UserList />
        <StoreList />
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
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
