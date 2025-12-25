import React, { useState } from 'react';
import { Search, Shield, Mail, MapPin, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const APolices = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const officers = [
    { id: 1, name: 'Officer John', email: 'john@police.gov', phone: '1234567890', province: 'Bagmati', cases: 24, status: 'on-duty' },
    { id: 2, name: 'Officer Jane', email: 'jane@police.gov', phone: '0987654321', province: 'Gandaki', cases: 15, status: 'off-duty' },
    { id: 3, name: 'Officer Bob', email: 'bob@police.gov', phone: '1122334455', province: 'Lumbini', cases: 8, status: 'on-duty' },
    { id: 4, name: 'Officer Alice', email: 'alice@police.gov', phone: '5566778899', province: 'Koshi', cases: 32, status: 'on-duty' },
  ];

  const stats = {
    total: 234,
    onDuty: 156,
    activeCases: 89
  };

  const filteredOfficers = officers.filter(officer => 
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Police Officers Management</h1>
        <p className="text-gray-600 mt-2">View and manage all police officers</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Officers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Shield className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">On Duty</p>
              <p className="text-3xl font-bold text-gray-900">{stats.onDuty}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCases}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-amber-500" />
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Officer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Province</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cases</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.length > 0 ? (
                filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{officer.name}</p>
                          <p className="text-sm text-gray-500">{officer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{officer.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{officer.province}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`font-bold ${
                          officer.cases > 20 ? 'text-red-600' : 
                          officer.cases > 10 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          {officer.cases}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        officer.status === 'on-duty' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {officer.status === 'on-duty' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            On Duty
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Off Duty
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
                  <td colSpan={6} className="py-8 text-center">
                    <div className="max-w-md mx-auto">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No police officers found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No police officers registered yet'}
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

export default APolices;