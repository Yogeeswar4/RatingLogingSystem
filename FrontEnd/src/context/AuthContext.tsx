import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import { fetcher } from "../utils/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  role: "admin" | "user" | "store_owner";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const logout = () => {
    console.warn("Logging out...");
    console.log("Logging out...");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<User & { exp: number }>(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            console.warn("Token expired. Logging out...");
            localStorage.removeItem("token");
            setTimeout(() => setUser(null), 0);
          } else {
            setUser({ id: decoded.userId, role: decoded.role });
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setTimeout(() => setUser(null), 0);
        }
      }
      setTokenChecked(true);
    };

    checkToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await fetcher<{ token: string; user: User }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        logout
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {tokenChecked ? children : null}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
