import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { RefreshCw, Shield } from "lucide-react";
import { toast } from "react-toastify";
import axiosService from "@/utils/axiosService";
import { REGISTER, RESEND_VERIFICATION_CODE } from "@/routes/serverEndpoint";
import { useTranslation } from "react-i18next";

const VerifyToken = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [token, setToken] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate(-1);
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    const num = value.replace(/\D/g, "");
    
    if (num.length > 1) {
      const digits = num.split("").slice(0, 6);
      const newToken = [...token];
      digits.forEach((digit, i) => {
        if (i < 6) newToken[i] = digit;
      });
      setToken(newToken);
      
      if (inputRefs.current[digits.length < 6 ? digits.length : 5]) {
        inputRefs.current[digits.length < 6 ? digits.length : 5].focus();
      }
    } else {
      const newToken = [...token];
      newToken[index] = num;
      setToken(newToken);
      
      if (num && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (token[index] === "" && index > 0) {
        const newToken = [...token];
        newToken[index - 1] = "";
        setToken(newToken);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newToken = [...token];
        newToken[index] = "";
        setToken(newToken);
      }
    }
    
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullToken = token.join("");
    
    if (fullToken.length !== 6) {
      inputRefs.current.forEach(input => {
        input.style.transform = "translateX(10px)";
        setTimeout(() => input.style.transform = "translateX(-10px)", 100);
        setTimeout(() => input.style.transform = "translateX(0)", 200);
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosService.post(REGISTER, { email, token: fullToken });
      toast.success(response?.data?.message || t('emailVerifiedSuccess'));
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || t('verificationFailed'));
      inputRefs.current.forEach(input => {
        input.style.borderColor = "#ef4444";
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      const response = await axiosService.post(RESEND_VERIFICATION_CODE, { email });
      toast.success(response?.data?.message || t('codeResentSuccess'));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || t('resendFailed'));
    } finally {
      setToken(["", "", "", "", "", ""]);
      setCountdown(30);
      setIsResending(false);
      inputRefs.current[0]?.focus();
    }
  };

  const isTokenComplete = token.every(digit => digit !== "");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t('verifyYourEmail')}
          </h1>
          <p className="text-gray-600">
            {t('enterCodeSentTo')}
            <span className="font-semibold text-green-700 ml-1">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8">
            {token.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-3xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isTokenComplete || isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-lg mb-6 transition-all ${
              isTokenComplete
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                {t('verifying')}
              </span>
            ) : (
              t('verifyContinue')
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 mb-3">{t('didntReceiveCode')}</p>
            <button
              type="button"
              onClick={handleResendToken}
              disabled={countdown > 0 || isResending}
              className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t('sending')}
                </span>
              ) : countdown > 0 ? (
                `${t('resendIn')} ${countdown}s`
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {t('resendCode')}
                </span>
              )}
            </button>
          </div>
        </form>


        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-green-700 hover:text-green-800 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            ← {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyToken;