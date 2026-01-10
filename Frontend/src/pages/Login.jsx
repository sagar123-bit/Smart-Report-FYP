import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "react-toastify";
import { LOGIN } from "@/routes/serverEndpoint";
import axiosService from "@/utils/axiosService";
import ForgotPasswordDialog from "@/components/ForgetPassDialog";
import { fetchAuthUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosService.post(LOGIN, { email, password }, { withCredentials: true });
      toast.success(response?.data?.message || "Login successful.");
      await dispatch(fetchAuthUser());
      if (response?.data?.user?.userType === "admin") {
        navigate("/admindashboard");
      } else if (response?.data?.user?.userType === "police") {
        navigate("/policedashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="mb-4">
              <img 
                src="/images/logo.png" 
                alt="SmartReport Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back to SmartReport
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cursor-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="cursor-text"
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleForgotPassword}
                  className="cursor-pointer"
                >
                  Forgot your password?
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegister}
                  className="w-full cursor-pointer"
                >
                  Don't have an account? Register here
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {
        isForgotPasswordOpen && <ForgotPasswordDialog 
          open={isForgotPasswordOpen} 
          onOpenChange={setIsForgotPasswordOpen} 
        />
      }
    </>
  );
};

export default Login;