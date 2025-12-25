import React from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Clock, 
  CheckCircle,
  LogOut,
  Edit,
  Building,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  //demo data
  const userData = {
    name: 'John Doe',
    role: 'Citizen',
    email: 'john.doe@example.com',
    phoneNumber: '',
    province: 'Central Province',
    district: 'Colombo District',
    municipality: 'Colombo Municipal Council',
    totalCases: 24,
    pendingCases: 5,
    resolvedCases: 19,
    loginTime: 'Last login: 2 hours ago'
  };

  const hasPhoneNumber = userData.phoneNumber && userData.phoneNumber.trim() !== '';

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
                  <div className="relative mb-4 cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border hover:bg-gray-50 transition-colors cursor-pointer">
                      <Edit className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                  <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    <User className="h-3 w-3" />
                    {userData.role}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{userData.loginTime}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </h3>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{userData.email}</p>

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

                <div className="mt-8">
                  <Button variant="outline" className="w-full gap-2 hover:bg-red-50 hover:text-red-600 cursor-pointer">
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
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="cursor-pointer hover:shadow-sm transition-shadow">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Province
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{userData.province}</span>
                    </div>
                  </div>
                
                  <div className="cursor-pointer hover:shadow-sm transition-shadow">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      District
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-gray-900 font-medium">{userData.district}</span>
                    </div>
                  </div>
                
                  <div className="cursor-pointer hover:shadow-sm transition-shadow">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Municipality
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                      <Building className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-900 font-medium">{userData.municipality}</span>
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
                <div className="grid md:grid-cols-3 gap-6">
            
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-200 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-700" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{userData.totalCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Total Cases</h4>
                    <p className="text-gray-500 text-sm mt-1">All cases registered</p>
                  </div>

  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-200 rounded-lg">
                        <Clock className="h-6 w-6 text-amber-700" />
                      </div>
                      <span className="text-3xl font-bold text-amber-900">{userData.pendingCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Pending Cases</h4>
                    <p className="text-gray-500 text-sm mt-1">Awaiting resolution</p>
                  </div>

                 
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-200 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-emerald-700" />
                      </div>
                      <span className="text-3xl font-bold text-emerald-900">{userData.resolvedCases}</span>
                    </div>
                    <h4 className="text-gray-600 font-medium">Resolved</h4>
                    <p className="text-gray-500 text-sm mt-1">Successfully closed</p>
                  </div>
                </div>

        
                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Case Resolution Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((userData.resolvedCases / userData.totalCases) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 cursor-pointer">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(userData.resolvedCases / userData.totalCases) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{userData.pendingCases} pending</span>
                    <span>{userData.resolvedCases} resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>


            <div className="grid md:grid-cols-2 gap-6">
              <Button className="h-12 gap-3 cursor-pointer" variant="outline">
                <Edit className="h-4 w-4" />
                Edit Profile Information
              </Button>
              <Button className="h-12 gap-3 cursor-pointer">
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