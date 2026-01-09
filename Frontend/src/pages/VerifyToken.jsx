import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../components/ui/card";
import { CheckCircle, RefreshCw, Shield } from "lucide-react";
import gsap from "gsap";

const VerifyToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [token, setToken] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const inputRefs = useRef([]);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!email) {
      navigate(-1);
      return;
    }

    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      });
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
    const numericValue = value.replace(/\D/g, "");
    
    if (numericValue.length > 1) {
      const pastedDigits = numericValue.split("").slice(0, 6);
      const newToken = [...token];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newToken[i] = digit;
      });
      setToken(newToken);
      
      if (inputRefs.current[pastedDigits.length < 6 ? pastedDigits.length : 5]) {
        inputRefs.current[pastedDigits.length < 6 ? pastedDigits.length : 5].focus();
      }
    } else {
      const newToken = [...token];
      newToken[index] = numericValue;
      setToken(newToken);
      
      if (numericValue && index < 5 && inputRefs.current[index + 1]) {
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
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newToken = [...token];
        newToken[index] = "";
        setToken(newToken);
      }
    }
    
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
    
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullToken = token.join("");
    
    if (fullToken.length !== 6) {
      gsap.to(".token-input", {
        x: [0, 10, -10, 10, -10, 0],
        duration: 0.5,
        stagger: 0.05
      });
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (fullToken === "123456") {
      gsap.to(".token-input", {
        backgroundColor: "#d1fae5",
        borderColor: "#10b981",
        scale: 1.1,
        duration: 0.3,
        stagger: 0.05,
        yoyo: true,
        repeat: 1
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/dashboard");
    } else {
      gsap.to(".token-input", {
        borderColor: "#ef4444",
        duration: 0.3,
        stagger: 0.05
      });
      setIsLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    
    gsap.to(".resend-icon", {
      rotation: 360,
      duration: 0.8,
      ease: "power2.out"
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setToken(["", "", "", "", "", ""]);
    setCountdown(30);
    
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    setIsResending(false);
  };

  const isTokenComplete = token.every(digit => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" ref={cardRef}>
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            Enter the 6-digit code sent to
            <span className="font-semibold text-green-700"> {email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
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
                    className="token-input w-14 h-14 text-center text-3xl font-bold rounded-xl border-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all border-gray-300"
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                <Button
                  type="submit"
                  className={`w-full py-6 text-lg font-semibold ${
                    isTokenComplete
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      : "bg-green-300 cursor-not-allowed"
                  } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  disabled={!isTokenComplete || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <div className="text-gray-600">
                  <p className="mb-2">Didn't receive the code?</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendToken}
                    disabled={countdown > 0 || isResending}
                    className="resend-button text-green-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium"
                  >
                    {isResending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin resend-icon" />
                        Sending...
                      </span>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 resend-icon" />
                        Resend Code
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyToken;