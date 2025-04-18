import { createFileRoute, Outlet } from "@tanstack/react-router";
import UserNavbar from "../components/UserNavbar";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <UserNavbar />
      <Outlet />
    </div>
  );
}
