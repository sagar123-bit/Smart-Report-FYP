import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axiosService from "@/utils/axiosService";
import { USER_BEFORE_REGISTER } from "@/routes/serverEndpoint";
import { fetchAllUsers } from "@/store/slices/getAllUsers";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("citizen");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});



  const [citizenForm, setCitizenForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    password: "",
    confirmPassword: ""
  });

  const [policeForm, setPoliceForm] = useState({
    userName: "",
    policeId: "",
    rank: "",
    phoneNumber: "",
    email: "",
    province: "",
    district: "",
    station: "",
    password: "",
    confirmPassword: ""
  });

  console.log("Citizen Form:", policeForm);

  const handleCitizenChange = (field, value) => {
    setCitizenForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePoliceChange = (field, value) => {
    setPoliceForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const form = userType === "citizen" ? citizenForm : policeForm;

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = t('phoneNumberError');
    }

    if (form.password.length < 6) {
      newErrors.password = t('passwordLengthError');
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t('passwordMatchError');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (form.password && !passwordRegex.test(form.password)) {
      newErrors.password = t('passwordComplexityError');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    let formData;

    if (userType === "citizen") {
      const { confirmPassword, ...rest } = citizenForm;
      formData = { userType: "citizen", ...rest };
    } else {
      const { policeId, rank, station, confirmPassword, ...rest } = policeForm;
      formData = {
        userType: "police",
        ...rest,
        policeData: { policeId, rank, station } 
      };
    }
    // console.log(formData);
    try {
      const response = await axiosService.post(USER_BEFORE_REGISTER, formData);
      await dispatch(fetchAllUsers());
      toast.success(
        response?.data?.message || t('registrationSuccess')
      );
      navigate("/verifytoken", { state: { email: formData.email } });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || t('registrationFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (e, isCitizen = true) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (isCitizen) {
      handleCitizenChange("phoneNumber", value);
    } else {
      handlePoliceChange("phoneNumber", value);
    }
  };

  // Keep province values in English for backend, but show translated labels
  const provinces = [
    { value: "Koshi", label: t('koshi') },
    { value: "Madesh", label: t('madhesh') },
    { value: "Bagmati", label: t('bagmati') },
    { value: "Gandaki", label: t('gandaki') },
    { value: "Lumbini", label: t('lumbini') },
    { value: "Karnali", label: t('karnali') },
    { value: "Sudurpashchim", label: t('sudurpashchim') }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="SmartReport Logo"
            className="h-16 w-16 object-contain mb-4"
          />
          <CardTitle className="text-2xl font-bold text-center">{t('register')}</CardTitle>
          <CardDescription className="text-center">
            {t('createAccount')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center mb-8">
            <div className="flex border rounded-lg p-1">
              <Button
                type="button"
                variant={userType === "citizen" ? "default" : "ghost"}
                onClick={() => setUserType("citizen")}
                className="px-6"
              >
                {t('citizen')}
              </Button>
              <Button
                type="button"
                variant={userType === "police" ? "default" : "ghost"}
                onClick={() => setUserType("police")}
                className="px-6"
              >
                {t('policeOfficer')}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === "citizen" ? (
              <>
                <div className="space-y-2">
                  <Label>{t('username')}</Label>
                  <Input
                    value={citizenForm.userName}
                    onChange={(e) => handleCitizenChange("userName", e.target.value)}
                    required
                    placeholder={t('usernamePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('email')}</Label>
                  <Input
                    type="email"
                    value={citizenForm.email}
                    onChange={(e) => handleCitizenChange("email", e.target.value)}
                    required
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('phoneNumber')}</Label>
                  <Input
                    type="tel"
                    value={citizenForm.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e, true)}
                    required
                    maxLength={10}
                    placeholder={t('phoneNumberPlaceholder')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('province')}</Label>
                    <Select
                      value={citizenForm.province}
                      onValueChange={(value) => handleCitizenChange("province", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectProvince')}>
                          {citizenForm.province ? 
                            provinces.find(p => p.value === citizenForm.province)?.label : 
                            t('selectProvince')
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('district')}</Label>
                    <Input
                      value={citizenForm.district}
                      onChange={(e) => handleCitizenChange("district", e.target.value)}
                      required
                      placeholder={t('districtPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label>{t('password')}</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('passwordPlaceholder')}
                        value={citizenForm.password}
                        onChange={(e) => handleCitizenChange("password", e.target.value)}
                        required
                        minLength={6}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label>{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t('confirmPasswordPlaceholder')}
                        value={citizenForm.confirmPassword}
                        onChange={(e) => handleCitizenChange("confirmPassword", e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>{t('username')}</Label>
                  <Input
                    placeholder={t('usernamePlaceholder')}
                    value={policeForm.userName}
                    onChange={(e) => handlePoliceChange("userName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('policeId')}</Label>
                    <Input
                      placeholder={t('policeIdPlaceholder')}
                      value={policeForm.policeId}
                      onChange={(e) => handlePoliceChange("policeId", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('rank')}</Label>
                    <Input
                      placeholder={t('rankPlaceholder')}
                      value={policeForm.rank}
                      onChange={(e) => handlePoliceChange("rank", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('phoneNumber')}</Label>
                    <Input
                      type="tel"
                      placeholder={t('phoneNumberPlaceholder')}
                      value={policeForm.phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e, false)}
                      required
                      maxLength={10}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={policeForm.email}
                      onChange={(e) => handlePoliceChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('province')}</Label>
                    <Select
                      value={policeForm.province}
                      onValueChange={(v) => handlePoliceChange("province", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('provincePlaceholder')}>
                          {policeForm.province ? 
                            provinces.find(p => p.value === policeForm.province)?.label : 
                            t('provincePlaceholder')
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('district')}</Label>
                    <Input
                      placeholder={t('districtPlaceholder')}
                      value={policeForm.district}
                      onChange={(e) => handlePoliceChange("district", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('policeStation')}</Label>
                    <Input
                      placeholder={t('policeStationPlaceholder')}
                      value={policeForm.station}
                      onChange={(e) => handlePoliceChange("station", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label>{t('password')}</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('passwordPlaceholder')}
                        value={policeForm.password}
                        onChange={(e) => handlePoliceChange("password", e.target.value)}
                        required
                        minLength={6}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label>{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t('confirmPasswordPlaceholder')}
                        value={policeForm.confirmPassword}
                        onChange={(e) => handlePoliceChange("confirmPassword", e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('registering') : t('register')}
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" onClick={() => navigate("/login")}>
                {t('alreadyHaveAccount')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;