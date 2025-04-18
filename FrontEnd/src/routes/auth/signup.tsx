import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fetcher } from "../../utils/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Initialize loading state

  useEffect(() => {
    if (user) {
      if (user.role === "user") {
        navigate({ to: "/dashboard" });
      } else if (user.role === "store_owner") {
        navigate({ to: "/owner/dashboard" });
      }
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Set loading to true when form is submitted

    // Validation
    if (form.name.length < 20 || form.name.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      setLoading(false); // Stop loading on validation error
      return;
    }
    if (form.address.length > 400) {
      setError("Address must be less than 400 characters.");
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character."
      );
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...form, role: "user" }),
      });
      setLoading(false); // Stop loading after successful submission
      navigate({ to: "/auth/login" });
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-teal-600 to-blue-700 opacity-20"></div>
      </div>

      {/* Rating and Feedback Section */}
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

      {/* Chocolate 5-Star Rating Image Section */}
      <div className="absolute top-20 left-0 right-0 z-10 text-center text-white opacity-80">
        <p className="text-lg">Our users rate us 5 stars! 🍫</p>
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/355/389/non_2x/five-5-star-rank-sign-illustration-free-vector.jpg"
          alt="Chocolate covered 5-star rating"
          className="mx-auto mt-4 rounded-xl shadow-lg"
        />
        <p className="mt-2 text-lg">5-Star Rating: "Delicious!"</p>
        <p className="mt-2 italic text-sm text-gray-300">"This is a placeholder comment to show user feedback." (Read-only)</p>
      </div>

      {/* Sign Up Form Section */}
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl z-10">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          Sign Up to Rate
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

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
            <label className="block text-gray-700 mb-2" htmlFor="address">
              Address
            </label>
            <input
              className="w-full px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              type="text"
              name="address"
              placeholder="Street, City, State, Postal Code"
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
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl hover:bg-gradient-to-l transition-all duration-300 ease-in-out transform ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-indigo-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
