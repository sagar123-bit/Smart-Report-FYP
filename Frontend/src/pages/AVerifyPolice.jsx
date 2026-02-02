import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Shield, Mail, MapPin, Calendar, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserDetailsDrawer from '@/components/UserDetailsDrawer';
import axiosService from '@/utils/axiosService';
import { fetchAllUsers } from '@/store/slices/getAllUsers';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { VERIFY_POLICE } from '@/routes/serverEndpoint';

const AVerifyPolice = () => {
  const { users } = useSelector(state => state?.allUsers);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const pendingPolice = users?.filter(user => 
    user.userType === "police" && 
    user.policeData?.status === "pending"
  ) || [];

  const filterUsers = () => {
    let filtered = pendingPolice;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm) ||
        user.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.policeData?.policeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.policeData?.station?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.policeData?.rank?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(user => new Date(user.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(user => new Date(user.createdAt) <= end);
    }

    return filtered;
  };

  const filteredPolice = filterUsers();

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleVerification = async (userId, type) => {
    if (loadingUserId) return;
    
    setLoadingUserId(userId);
    try {
      const response = await axiosService.patch(`${VERIFY_POLICE}/${userId}`, 
        { status: type === 'accept' ? 'verified' : 'rejected' }, 
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        await dispatch(fetchAllUsers());
        toast.success(response?.data?.message || `Police officer ${type === 'accept' ? 'verified' : 'rejected'} successfully.`);
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error(error?.response?.data?.message || `Failed to ${type === 'accept' ? 'verify' : 'reject'} police officer.`);
    } finally {
      setLoadingUserId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Police Verification</h1>
        <p className="text-gray-600 mt-2">Review and verify pending police officer registrations</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Verifications</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{pendingPolice.length}</p>
            </div>
            <Shield className="h-10 w-10 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {pendingPolice.filter(user => {
                  const date = new Date(user.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Awaiting Review</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{filteredPolice.length}</p>
            </div>
            <Eye className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, email, police ID, station, or rank..." 
              className="pl-9 w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border rounded-md p-2 w-full md:w-auto relative right-10">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
              <Input 
                type="date" 
                placeholder="From"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-28 md:w-32"
              />
              <span className="text-gray-400 text-sm flex-shrink-0">to</span>
              <Input 
                type="date" 
                placeholder="To"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-28 md:w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[200px]">Officer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[150px]">Police Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[150px]">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[120px]">Applied On</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[120px]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolice.length > 0 ? (
                filteredPolice.map((officer) => (
                  <tr key={officer._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{officer.userName}</p>
                          <p className="text-sm text-gray-500 truncate">{officer.email}</p>
                          <p className="text-xs text-gray-400 truncate">{officer.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 min-w-[150px]">
                      <div className="min-w-0">
                        <p className="font-medium truncate">ID: {officer.policeData?.policeId || 'N/A'}</p>
                        <p className="text-sm text-gray-500 truncate">Station: {officer.policeData?.station || 'N/A'}</p>
                        <p className="text-xs text-gray-400 truncate">Rank: {officer.policeData?.rank || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 min-w-[150px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{officer.district}, {officer.province}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 min-w-[120px]">
                      {formatDate(officer.createdAt)}
                    </td>
                    <td className="py-3 px-4 min-w-[120px]">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                        Pending Review
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(officer)}
                          className="gap-1 flex-shrink-0"
                          disabled={loadingUserId === officer._id}
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-1 bg-green-600 hover:bg-green-700 flex-shrink-0"
                          onClick={() => handleVerification(officer?._id, 'accept')}
                          disabled={loadingUserId === officer._id}
                        >
                          {loadingUserId === officer._id && officer._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          <span className="whitespace-nowrap">
                            {loadingUserId === officer._id ? 'Processing...' : 'Accept'}
                          </span>
                        </Button>
                        
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-1 flex-shrink-0"
                          onClick={() => handleVerification(officer?._id, 'reject')}
                          disabled={loadingUserId === officer._id}
                        >
                          {loadingUserId === officer._id && officer._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span className="whitespace-nowrap">
                            {loadingUserId === officer._id ? 'Processing...' : 'Reject'}
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="max-w-md mx-auto">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pending verifications</h3>
                      <p className="text-gray-600">
                        {searchTerm || startDate || endDate ? 'Try adjusting your search criteria' : 'All police officers have been verified'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default AVerifyPolice;