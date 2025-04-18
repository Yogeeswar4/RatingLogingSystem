import { createFileRoute, Outlet } from "@tanstack/react-router";
import Protected from "../components/Protected";
import Navbar from "../components/navbar";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Protected role="admin">
      <Navbar />
      <Outlet />
    </Protected>
  );
}
