import { createFileRoute, Outlet } from "@tanstack/react-router";
import OwnerNavbar from "../components/OwnerNavbar";
export const Route = createFileRoute("/owner")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <OwnerNavbar />
      <Outlet />
    </div>
  );
}
