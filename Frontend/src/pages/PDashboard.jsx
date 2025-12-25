import React from 'react';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  Clock, 
  PlayCircle, 
  CheckCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalCases: 156,
    pending: 42,
    inProgress: 67,
    resolved: 47,
    allCases: 245,
    allPending: 89,
    allInProgress: 102,
    allResolved: 54,
    province: 'Central Province'
  };

  const recentCases = [];

  const handleViewAllReports = () => {
    navigate('/policedashboard/allreports');
  };

  const handleStartInvestigation = () => {
    navigate('/policedashboard/acceptedreports');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Manage cases from {stats.province}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Total Cases
            </CardTitle>
            <CardDescription>Cases in your province</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-4">{stats.totalCases}</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="font-medium text-amber-600">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">In Progress</span>
                </div>
                <span className="font-medium text-blue-600">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-gray-700">Resolved</span>
                </div>
                <span className="font-medium text-emerald-600">{stats.resolved}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Cases
            </CardTitle>
            <CardDescription>All system cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-4">{stats.allCases}</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="font-medium text-amber-600">{stats.allPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">In Progress</span>
                </div>
                <span className="font-medium text-blue-600">{stats.allInProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-gray-700">Resolved</span>
                </div>
                <span className="font-medium text-emerald-600">{stats.allResolved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
            <p className="text-gray-600">Latest cases from your province</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search cases..." 
                className="pl-9 w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {recentCases.length === 0 ? (
          <Card className="border-dashed border-gray-300">
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No cases in your province yet. Cases will appear here once reported.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-12 gap-3 cursor-pointer "
            onClick={handleViewAllReports}
          >
            <FileText className="h-4 w-4" />
            View All Reports
          </Button>
          <Button 
            className="h-12 gap-3 cursor-pointer "
            onClick={handleStartInvestigation}
          >
            <PlayCircle className="h-4 w-4" />
            Start New Investigation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDashboard;