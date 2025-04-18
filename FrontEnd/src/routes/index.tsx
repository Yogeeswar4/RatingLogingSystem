import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  if (!auth?.user) {
    navigate({ to: "/auth/login" });
    return null;
  }
  if (auth.user.role === "admin") {
    navigate({ to: "/admin/dashboard", replace: true });
    return null;
  }
  if (auth.user.role === "store_owner") {
    navigate({ to: "/owner/dashboard", replace: true });
    return null;
  }
  if (auth.user.role === "user") {
    navigate({ to: "/dashboard", replace: true });
    return null;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
