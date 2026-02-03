import EditProfileDialog from '@/components/EditProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { USER_IMAGE } from '@/routes/serverEndpoint';
import { fetchAuthUser, logoutUser } from '@/store/slices/userSlice';
import axiosService from '@/utils/axiosService';
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
  Upload,
  User,
  XCircle
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state?.user?.user);
  const crimeReports = useSelector(state=>state?.allReports?.reports);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userReports = crimeReports?.filter(report => 
    report.reportedBy._id === userData?._id
  ) || [];

  const userStats = {
    totalCases: userReports.length,
    pendingCases: userReports.filter(report => report.status === 'pending').length,
    inProgressCases: userReports.filter(report => report.status === 'in progress').length,
    resolvedCases: userReports.filter(report => report.status === 'resolved').length,
    rejectedCases: userReports.filter(report => report.status === 'rejected').length,
  };

  const hasPhoneNumber = userData?.phoneNumber && userData.phoneNumber.trim() !== '';
  const hasProfileImage = userData?.userImage;
  
  const getInitials = () => {
    if (userData?.userName) {
      return userData.userName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('userImage', file);

    try {
      const response = await axiosService.post(USER_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if(response.status===200){
        await dispatch(fetchAuthUser());
        toast.success(response?.data?.message||hasProfileImage ? 'Profile image updated!' : 'Profile image set!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message||'Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!hasProfileImage) return;
    setIsLoading(true);
    try {
      const response = await axiosService.delete(USER_IMAGE, { withCredentials: true });
      await dispatch(fetchAuthUser());
      toast.success(response?.data?.message||'Profile image deleted!');
    } catch (error) {
      toast.error(error?.response?.data?.message||'Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    await dispatch(fetchAuthUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and settings</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    {hasProfileImage ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                        <img 
                          src={`${import.meta.env.VITE_SERVER_URL}/${userData.userImage}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                        <span className="text-2xl font-bold text-white">
                          {getInitials()}
                        </span>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900">{userData?.userName || 'User Name'}</h2>
                  <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    <User className="h-3 w-3" />
                    {userData?.userType || 'Citizen'}
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleEditImageClick}
                      variant={hasProfileImage ? "default" : "outline"}
                      disabled={isLoading}
                      className="gap-2 cursor-pointer w-full"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : hasProfileImage ? (
                        <>
                          <Camera className="h-4 w-4" />
                          Change Profile Image
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Set Profile Image
                        </>
                      )}
                    </Button>
                    
                    {hasProfileImage && (
                      <Button
                        onClick={handleDeleteImage}
                        disabled={isLoading}
                        variant="destructive"
                        className="gap-2 cursor-pointer w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Profile Image
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </h3>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{userData?.email || 'user@example.com'}</p>

                  <h3 className="font-semibold text-gray-700 flex items-center gap-2 mt-4">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </h3>
                  
                  {hasPhoneNumber ? (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{userData.phoneNumber}</p>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 cursor-pointer hover:bg-amber-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-amber-800 font-medium mb-1">Phone Number Missing</p>
                          <p className="text-amber-700 text-sm">
                            Please add your phone number by editing your profile.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  <Button 
                    onClick={() => navigate("/report-chat")}
                    variant="outline" 
                    className="w-full gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat with Police
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-2/3 space-y-8">
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </CardTitle>
                <CardDescription>
                  Your registered location details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="cursor-pointer hover:shadow-sm transition-shadow">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Province
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{userData?.province || 'Not set'}</span>
                    </div>
                  </div>
                
                  <div className="cursor-pointer hover:shadow-sm transition-shadow">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      District
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-gray-900 font-medium">{userData?.district || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Account Statistics
                </CardTitle>
                <CardDescription>
                  Overview of your case history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-200 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-700" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{userStats.totalCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Total Cases</h4>
                    <p className="text-gray-500 text-sm mt-1">All cases registered</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-200 rounded-lg">
                        <Clock className="h-6 w-6 text-amber-700" />
                      </div>
                      <span className="text-3xl font-bold text-amber-900">{userStats.pendingCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Pending</h4>
                    <p className="text-gray-500 text-sm mt-1">Awaiting resolution</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-200 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-700" />
                      </div>
                      <span className="text-3xl font-bold text-blue-900">{userStats.inProgressCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">In Progress</h4>
                    <p className="text-gray-500 text-sm mt-1">Under investigation</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-200 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-emerald-700" />
                      </div>
                      <span className="text-3xl font-bold text-emerald-900">{userStats.resolvedCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Resolved</h4>
                    <p className="text-gray-500 text-sm mt-1">Successfully closed</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-200 rounded-lg">
                        <XCircle className="h-6 w-6 text-red-700" />
                      </div>
                      <span className="text-3xl font-bold text-red-900">{userStats.rejectedCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Rejected</h4>
                    <p className="text-gray-500 text-sm mt-1">Cases not accepted</p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Case Resolution Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {userStats.totalCases > 0 
                        ? Math.round((userStats.resolvedCases / userStats.totalCases) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 cursor-pointer">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: userStats.totalCases > 0 
                          ? `${(userStats.resolvedCases / userStats.totalCases) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{userStats.pendingCases + userStats.inProgressCases} ongoing</span>
                    <span>{userStats.resolvedCases} resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Button 
                onClick={() => setIsEditDialogOpen(true)}
                className="h-12 gap-3 cursor-pointer"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                Edit Profile Information
              </Button>
              {
                isEditDialogOpen &&
                <EditProfileDialog 
                  open={isEditDialogOpen} 
                  onOpenChange={setIsEditDialogOpen} 
                />
              }
              <Button onClick={()=>navigate("/myreport")} className="h-12 gap-3 cursor-pointer">
                <FileText className="h-4 w-4" />
                View All Cases
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
