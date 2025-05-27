import React, { useState } from "react";
import {
  ShoppingCart,
  ClipboardList,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const handleLogout = () => {
    // Clear cookies or localStorage
    dispatch(logout());
    // Redirect to login or landing
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-screen-xl mx-auto py-3 flex items-center justify-between">
        {/* Left Logo */}
        <div className="text-lg font-bold">
          <Link to="/" className="hover:underline">
            OShoPairIn.com
          </Link>
        </div>

        {/* Center Search */}
        {/* <div className="flex-1 px-6 max-w-md hidden sm:flex">
          <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or brand..."
              className="flex-grow ml-3 outline-none border-none"
            />
          </div>
        </div> */}

        {/* Hamburger Menu Button (mobile only) */}
        <button
          className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Right Nav Links */}
        <nav
          className={`flex-col sm:flex-row flex items-start sm:items-center gap-4 text-sm font-medium absolute sm:static bg-white sm:bg-transparent w-full sm:w-auto left-0 sm:left-auto top-full sm:top-auto px-4 py-4 sm:p-0 border-t sm:border-none shadow sm:shadow-none z-20 ${
            menuOpen ? "flex" : "hidden"
          } sm:flex`}
        >
          <Link to="/" className="text-black hover:underline">
            Home
          </Link>
          <Link to="/products" className="text-black hover:underline">
            Products
          </Link>
          {auth.token && (
            <>
              <Link
                to="/orders"
                className="text-black hover:underline flex items-center gap-1"
              >
                <ClipboardList className="w-4 h-4" />
                Orders
              </Link>
              <Link
                to="/cart"
                className="text-black hover:underline flex items-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
