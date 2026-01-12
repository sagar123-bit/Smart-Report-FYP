import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosService from "@/utils/axiosService";
import { UPDATE_USER_PROFILE } from "@/routes/serverEndpoint";
import { User, Shield, Badge, MapPin, Building } from "lucide-react";
import { fetchAuthUser } from "@/store/slices/userSlice";

const EditProfileDialog = ({ open, onOpenChange }) => {
  const userData = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: userData?.userName || "",
    phoneNumber: userData?.phoneNumber || "",
    province: userData?.province || "",
    district: userData?.district || "",
    ...(userData?.userType === "police" && {
      rank: userData?.policeData?.rank || "",
      station: userData?.policeData?.station || ""
    })
  });

  const provinces = [
    "Province 1",
    "Province 2",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleChange("phoneNumber", value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let updateData = {
      userName: formData.userName,
      phoneNumber: formData.phoneNumber,
      province: formData.province,
      district: formData.district
    };

    if (userData?.userType === "police") {
      updateData = {
        ...updateData,
        policeData: {
          rank: formData.rank,
          station: formData.station
        }
      };
    }

    try {
      const response = await axiosService.patch(UPDATE_USER_PROFILE, updateData,{withCredentials:true});
      toast.success(response?.data?.message || "Profile updated successfully!");
      dispatch(fetchAuthUser());
      onOpenChange(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || 
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userName: userData?.userName || "",
      phoneNumber: userData?.phoneNumber || "",
      province: userData?.province || "",
      district: userData?.district || "",
      ...(userData?.userType === "police" && {
        rank: userData?.policeData?.rank || "",
        station: userData?.policeData?.station || ""
      })
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${userData?.userType === "police" ? "bg-blue-100" : "bg-green-100"}`}>
                  {userData?.userType === "police" ? (
                    <Shield className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {userData?.userType === "police" ? "Police Officer" : "Citizen"} Profile
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-gray-700 font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700 font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                    maxLength={10}
                    placeholder="Enter 10 digit number"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-gray-700 font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Province
                    </Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => handleChange("province", value)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-gray-700 font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      District
                    </Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {userData?.userType === "police" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rank" className="text-gray-700 font-medium flex items-center gap-2">
                          <Badge className="h-4 w-4" />
                          Rank
                        </Label>
                        <Input
                          id="rank"
                          value={formData.rank}
                          onChange={(e) => handleChange("rank", e.target.value)}
                          required
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="station" className="text-gray-700 font-medium flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Police Station
                        </Label>
                        <Input
                          id="station"
                          value={formData.station}
                          onChange={(e) => handleChange("station", e.target.value)}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;