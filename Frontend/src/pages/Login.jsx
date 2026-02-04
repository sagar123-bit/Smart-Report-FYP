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
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
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
      toast.success(response?.data?.message || t('loginSuccessful'));
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
      toast.error(error?.response?.data?.message || t('loginFailed'));
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
              {t('login')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('welcomeBack')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cursor-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
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
                {isLoading ? t('loggingIn') : t('login')}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleForgotPassword}
                  className="cursor-pointer"
                >
                  {t('forgotPassword')}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegister}
                  className="w-full cursor-pointer"
                >
                  {t('dontHaveAccount')}
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