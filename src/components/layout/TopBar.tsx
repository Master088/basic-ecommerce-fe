import React from "react";
import { Download, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

const TopBar = () => {
  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="w-full bg-gray-100 text-sm text-gray-700 px-4 py-2 flex justify-between items-center">
      {/* Left side (optional) */}
      <div className="hidden md:block">
        OShoPairIn — Best online deals every day!
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center gap-1 hover:underline">
          <Download className="w-4 h-4" />
          Download App
        </button>

        {!auth.token && (
          <>
            <Link
              to="/register"
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;