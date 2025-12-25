import React, { useState } from 'react';
import { Search, Filter, FileText, Clock, PlayCircle, CheckCircle, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AReports = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filterTabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  const reports = [
    { id: 'REP-001', crimeType: 'Theft', location: 'Kathmandu, Bagmati', province: 'Bagmati', status: 'Pending', reporter: 'John Doe', date: '2024-01-15' },
    { id: 'REP-002', crimeType: 'Assault', location: 'Pokhara, Gandaki', province: 'Gandaki', status: 'In Progress', reporter: 'Jane Smith', date: '2024-01-14' },
    { id: 'REP-003', crimeType: 'Fraud', location: 'Biratnagar, Koshi', province: 'Koshi', status: 'Resolved', reporter: 'Bob Wilson', date: '2024-01-13' },
    { id: 'REP-004', crimeType: 'Vandalism', location: 'Butwal, Lumbini', province: 'Lumbini', status: 'Pending', reporter: 'Alice Brown', date: '2024-01-12' },
    { id: 'REP-005', crimeType: 'Theft', location: 'Dharan, Koshi', province: 'Koshi', status: 'In Progress', reporter: 'Mike Johnson', date: '2024-01-11' },
    { id: 'REP-006', crimeType: 'Assault', location: 'Hetauda, Bagmati', province: 'Bagmati', status: 'Resolved', reporter: 'Sarah Davis', date: '2024-01-10' },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.province.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'All' || 
      report.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <PlayCircle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Reports</h1>
        <p className="text-gray-600 mt-2">System-wide crime reports overview</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by ID, crime type, location, or province..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeFilter === tab ? "default" : "outline"}
                className="px-4"
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Showing {filteredReports.length} of {reports.length} reports</p>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {filteredReports.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Report ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Crime Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Province</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reporter</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{report.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.crimeType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{report.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{report.province}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{report.reporter}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Assign</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'No reports in the system yet'}
            </p>
            {(searchTerm || activeFilter !== 'All') && (
              <div className="flex gap-3 justify-center">
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
                {activeFilter !== 'All' && (
                  <Button variant="outline" onClick={() => setActiveFilter('All')}>
                    Clear Filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AReports;