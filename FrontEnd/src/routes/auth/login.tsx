import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login, user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.role === "user") {
        navigate({ to: "/dashboard" });
      } else if (user.role === "store_owner") {
        navigate({ to: "/owner/dashboard" });
      }
    }
  }, [user, navigate]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = await login(form.email, form.password);
    if (success) {
      navigate({ to: "/" });
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
   
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-teal-600 to-blue-700 opacity-20"></div>
      </div>

      <div className="absolute top-5 left-0 right-0 z-10 text-center text-white text-xl font-semibold opacity-90">
        <p className="text-2xl">⭐ Rate our platform ⭐</p>
        <div className="flex justify-center mt-3 text-yellow-300 space-x-2">
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
          <i className="fas fa-star animate-pulse"></i>
        </div>
      </div>

     
      <div className="absolute top-20 left-0 right-0 z-10 text-center text-white opacity-80">
      
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/355/389/non_2x/five-5-star-rank-sign-illustration-free-vector.jpg"
          alt="Chocolate covered 5-star rating"
          className="mx-auto mt-4 rounded-xl shadow-lg"
        />
       </div>

      
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl z-10">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          Login to Rate
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button
  type="submit"
  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl hover:bg-gradient-to-l transition-all duration-300 ease-in-out transform cursor-pointer"
>
  Login
  <div className="cursor-effect"></div>
          </button>

        </form>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <Link to={"/auth/signup"} className="text-indigo-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
