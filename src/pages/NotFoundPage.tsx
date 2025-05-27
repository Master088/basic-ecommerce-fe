 import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-lg font-semibold text-gray-700">
          Page Not Found
        </p>
        <p className="text-gray-500">
          The page you are looking for might have been removed or temporarily unavailable.
        </p>
        <Button asChild className="bg-black hover:bg-black/80 text-white">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
