import React from 'react';
import { User, Mail, MapPin, Shield, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

const UserDetailsDrawer = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    return `${baseUrl}/${imagePath}`;
  };

  const imageUrl = getImageUrl(user.userImage);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>User Details</DrawerTitle>
              <DrawerDescription>
                View detailed information about this user
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={user.userName}
                  className="h-full w-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<User className="h-10 w-10 text-blue-600" />';
                  }}
                />
              ) : (
                <User className="h-10 w-10 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.userName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Active' : 'Banned'}
                </span>
                <span className="text-sm text-gray-500 capitalize">{user.userType}</span>
                <span className="text-sm text-gray-500">ID: {user.userId}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Contact Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Location Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Province</p>
                  <p className="font-medium">{user.province}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{user.district}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>

            {user.userType === "police" && user.policeData && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Police Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Police ID</p>
                    <p className="font-medium">{user.policeData.policeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rank</p>
                    <p className="font-medium capitalize">{user.policeData.rank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Station</p>
                    <p className="font-medium">{user.policeData.station}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.policeData.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.policeData.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDetailsDrawer;