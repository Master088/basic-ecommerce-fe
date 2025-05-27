import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerRequest, clearError } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Lock, User, Home } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerRequest({ email, password, name, address }));
  };

  useEffect(() => {
    if (auth.token) {
      navigate('/');
    }
  }, [auth.token, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear form fields on successful registration
  useEffect(() => {
    if (auth.successMessage) {
      setEmail('');
      setPassword('');
      setName('');
      setAddress('');
    }
  }, [auth.successMessage]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <NavBar />

      <div className="flex justify-center items-center min-h-[70vh] bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Create Your Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white
                           focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white
                           focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white
                           focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* Address */}
            <div className="relative">
              <Home
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700
                           bg-white
                           focus:outline-none focus:border-gray-400 focus:bg-gray-50
                           transition-colors duration-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Success message */}
            {auth.successMessage && (
              <div className="text-green-700 bg-green-100 border border-green-400 rounded-md p-2 text-sm mb-4 text-center">
                {auth.successMessage}
              </div>
            )}

            {/* Error message */}
            {auth.error && (
              <div className="text-red-600 bg-red-100 border border-red-400 rounded-md p-2 text-sm mb-4 text-center">
                {auth.error}
              </div>
            )}

            <button
              type="submit"
              disabled={auth.loading}
              className={`w-full py-2 rounded-md text-white transition-colors duration-200 ${
                auth.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {auth.loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
