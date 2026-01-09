import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <img
            src="/images/logo.png"
            alt="SmartReport Logo"
            className="h-24 w-24 object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>

          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;