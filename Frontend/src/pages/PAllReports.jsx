import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAllReports = () => {
  const filterTabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Reports</h1>
        <p className="text-gray-600 mt-2">View and manage all crime reports from your province</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by ID, crime type, or location..." 
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant="outline"
              className="px-4"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Showing 0 of 0 reports</p>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    </div>
  );
};

export default PAllReports;