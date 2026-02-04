import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import axiosService from "@/utils/axiosService";
import { FORGET_PASSWORD } from "@/routes/serverEndpoint";
import { Mail, Shield, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ForgotPasswordDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('enterEmailError'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('validEmailError'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosService.post(FORGET_PASSWORD, { email });
      toast.success(response?.data?.message || t('resetEmailSent'));
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || 
        t('resetEmailFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl p-6 border shadow-xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {t('forgotPassword')}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {t('resetPasswordDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="forgot-email" className="text-gray-700 font-medium">
                {t('email')}
              </Label>
              <span className="text-xs text-gray-500">{t('required')}</span>
            </div>
            <div className="relative">
              <Input
                id="forgot-email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
                className="w-full h-11 rounded-lg pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800">{t('secureReset')}</p>
                <p className="text-xs text-emerald-700 mt-1">
                  {t('secureResetDescription')}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('processing')}
                </span>
              ) : (
                t('sendResetEmail')
              )}
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500">
            {t('noEmailReceived')}{" "}
            <button
              type="button"
              onClick={handleSubmit}
              className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              {t('tryAgain')}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;