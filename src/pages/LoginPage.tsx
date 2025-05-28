import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginRequest } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { error, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <Navbar />

      <div className="flex justify-center items-center min-h-[70vh] bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 bg-red-100 border border-red-400 rounded-md p-2 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 hover:cursor-pointer"
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
