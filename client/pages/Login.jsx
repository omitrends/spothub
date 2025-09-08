import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../src/api/api";
import { useAuth } from "../src/context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiLogin({ email, password });
      const { token, user } = res.data;

      contextLogin(token, user);
      toast.success("Login successful!");
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Login failed:", msg);
      toast.error(
        msg === 'Please verify your email before logging in'
          ? 'Please verify your email. Check your inbox.'
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-600">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {[
                {
                  href: "http://localhost:4000/api/auth/google",
                  img: "/assets/google.svg",
                  text: "Google",
                }
              ].map((btn, index) => (
                <a
                  key={index}
                  href={btn.href}
                  className="w-full inline-flex justify-center items-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <img
                    src={btn.img}
                    alt={btn.text}
                    className="w-5 h-5"
                  />
                  <span>{btn.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 