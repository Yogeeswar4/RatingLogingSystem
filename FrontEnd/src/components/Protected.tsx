import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

interface ProtectedProps {
  role?: "admin" | "user" | "store_owner";
  children: React.ReactNode;
}

export default function Protected({
  role,
  children,
}: Readonly<ProtectedProps>) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  if (!auth?.user) {
    navigate({ to: "/auth/login" });
    return null;
  }

  if (role && auth.user.role !== role) {
    navigate({ to: "/" });
    return null;
  }

  return children;
}
