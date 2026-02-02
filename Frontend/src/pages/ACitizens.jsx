import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserDetailsDrawer from '@/components/UserDetailsDrawer';
import { UPDATE_USER_STATUS } from '@/routes/serverEndpoint';
import { fetchAllUsers } from '@/store/slices/getAllUsers';
import axiosService from '@/utils/axiosService';
import { Ban, Calendar, CheckCircle, Eye, Mail, MapPin, Search, User, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ACitizens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const dispatch = useDispatch();
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const { users } = useSelector(state => state?.allUsers);

  const citizenUsers = users?.filter(user => user.userType === "citizen") || [];

  const stats = {
    total: citizenUsers.length,
    active: citizenUsers.filter(user => user.status === "active").length,
    banned: citizenUsers.filter(user => user.status === "banned").length
  };

  const filterUsers = () => {
    let filtered = citizenUsers;

    if (activeTab === 'active') {
      filtered = filtered.filter(user => user.status === "active");
    } else if (activeTab === 'banned') {
      filtered = filtered.filter(user => user.status === "banned");
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm) ||
        user.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.district?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const filteredCitizens = filterUsers();

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleUserStatus = async (userId, status, userName) => {
    if (loadingUserId) return; // Prevent multiple clicks
    
    setLoadingUserId(userId);
    try {
      const response = await axiosService.patch(`${UPDATE_USER_STATUS}/${userId}`, { status }, { withCredentials: true });
      if (response.status === 200) {
        await dispatch(fetchAllUsers());
        toast.success(response?.data?.message || `User ${status === 'banned' ? 'banned' : 'unbanned'} successfully.`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(error?.response?.data?.message || "Failed to update user status.");
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

  const tabs = [
    { id: 'all', label: 'All Users', count: stats.total },
    { id: 'active', label: 'Active', count: stats.active },
    { id: 'banned', label: 'Banned', count: stats.banned }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Citizens Management</h1>
        <p className="text-gray-600 mt-2">View and manage all registered citizens</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Citizens</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <User className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Banned Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.banned}</p>
            </div>
            <Ban className="h-10 w-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, email, phone, or location..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input 
                type="date" 
                placeholder="From"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">-</span>
              <Input 
                type="date" 
                placeholder="To"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => (
                  <tr key={citizen._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{citizen.userName}</p>
                          <p className="text-sm text-gray-500">{citizen.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{citizen.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{citizen.district}, {citizen.province}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(citizen.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        citizen.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {citizen.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Banned
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(citizen)}
                          className="gap-1"
                          disabled={loadingUserId === citizen._id}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {citizen.status === 'active' ? (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleUserStatus(citizen?._id, 'banned', citizen.userName)}
                            disabled={loadingUserId === citizen._id}
                          >
                            {loadingUserId === citizen._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Ban className="h-3 w-3" />
                            )}
                            {loadingUserId === citizen._id ? 'Processing...' : 'Ban'}
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleUserStatus(citizen?._id, 'active', citizen.userName)}
                            disabled={loadingUserId === citizen._id}
                          >
                            {loadingUserId === citizen._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {loadingUserId === citizen._id ? 'Processing...' : 'Unban'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="max-w-md mx-auto">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No citizens found</h3>
                      <p className="text-gray-600">
                        {searchTerm || startDate || endDate ? 'Try adjusting your search criteria' : 'No citizens registered yet'}
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
};

export default ACitizens;