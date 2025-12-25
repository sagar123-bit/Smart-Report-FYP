import React, { useState } from 'react';
import { Search, User, Mail, MapPin, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ACitizens = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const citizens = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', province: 'Bagmati', district: 'Kathmandu', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', province: 'Gandaki', district: 'Pokhara', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '1122334455', province: 'Lumbini', district: 'Butwal', status: 'inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '5566778899', province: 'Koshi', district: 'Biratnagar', status: 'active' },
  ];

  const stats = {
    total: 1560,
    activeToday: 42,
    newThisMonth: 89
  };

  const filteredCitizens = citizens.filter(citizen => 
    citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-gray-600 text-sm">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeToday}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New This Month</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newThisMonth}</p>
            </div>
            <User className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, email, or province..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Province</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => (
                  <tr key={citizen.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{citizen.name}</p>
                          <p className="text-sm text-gray-500">{citizen.phone}</p>
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
                        <span>{citizen.province}, {citizen.district}</span>
                      </div>
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
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="max-w-md mx-auto">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No citizens found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No citizens registered yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ACitizens;