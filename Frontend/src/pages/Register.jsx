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

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("citizen");
  const [isLoading, setIsLoading] = useState(false);

  
  const [citizenForm, setCitizenForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    password: "",
    confirmPassword: ""
  });

  const [policeForm, setPoliceForm] = useState({
    username: "",
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

  const handleCitizenChange = (field, value) => {
    setCitizenForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePoliceChange = (field, value) => {
    setPoliceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData =
      userType === "citizen"
        ? { userType: "citizen", ...citizenForm }
        : { userType: "police", ...policeForm };

    console.log("Registering:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate("/login");
    setIsLoading(false);
  };

  const provinces = [
    "Province 1",
    "Province 2",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim"
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
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Create your SmartReport account
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
                Citizen
              </Button>
              <Button
                type="button"
                variant={userType === "police" ? "default" : "ghost"}
                onClick={() => setUserType("police")}
                className="px-6"
              >
                Police Officer
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === "citizen" ? (
              <>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={citizenForm.username}
                    onChange={(e) =>
                      handleCitizenChange("username", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={citizenForm.email}
                    onChange={(e) =>
                      handleCitizenChange("email", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={citizenForm.phoneNumber}
                    onChange={(e) =>
                      handleCitizenChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select
                      value={citizenForm.province}
                      onValueChange={(value) =>
                        handleCitizenChange("province", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem
                            key={p}
                            value={p.toLowerCase().replace(" ", "-")}
                          >
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input
                      value={citizenForm.district}
                      onChange={(e) =>
                        handleCitizenChange("district", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={citizenForm.password}
                    onChange={(e) =>
                      handleCitizenChange("password", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={citizenForm.confirmPassword}
                    onChange={(e) =>
                      handleCitizenChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <Input
                  placeholder="Username"
                  value={policeForm.username}
                  onChange={(e) =>
                    handlePoliceChange("username", e.target.value)
                  }
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Police ID"
                    value={policeForm.policeId}
                    onChange={(e) =>
                      handlePoliceChange("policeId", e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Rank"
                    value={policeForm.rank}
                    onChange={(e) =>
                      handlePoliceChange("rank", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={policeForm.phoneNumber}
                    onChange={(e) =>
                      handlePoliceChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={policeForm.email}
                    onChange={(e) =>
                      handlePoliceChange("email", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={policeForm.province}
                    onValueChange={(v) =>
                      handlePoliceChange("province", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem
                          key={p}
                          value={p.toLowerCase().replace(" ", "-")}
                        >
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="District"
                    value={policeForm.district}
                    onChange={(e) =>
                      handlePoliceChange("district", e.target.value)
                    }
                    required
                  />

                  <Input
                    placeholder="Police Station"
                    value={policeForm.station}
                    onChange={(e) =>
                      handlePoliceChange("station", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={policeForm.password}
                    onChange={(e) =>
                      handlePoliceChange("password", e.target.value)
                    }
                    required
                    minLength={6}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={policeForm.confirmPassword}
                    onChange={(e) =>
                      handlePoliceChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Already have an account? Login here
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
