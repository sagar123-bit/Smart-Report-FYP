import React from 'react';
import { useNavigate } from 'react-router';
import { FileText, PlayCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PAcceptedReports = () => {
  const navigate = useNavigate();

  const stats = {
    totalAssigned: 0,
    inProgress: 0,
    resolved: 0
  };

  const handleViewAllReports = () => {
    navigate('/policedashboard/allreports');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Accepted Reports</h1>
        <p className="text-gray-600 mt-2">Cases assigned to you for investigation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Total Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{stats.totalAssigned}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted cases yet</h3>
          <p className="text-gray-600 mb-6">
            Accept cases from the reports page to start investigating
          </p>
          <Button 
            onClick={handleViewAllReports}
            className="gap-2"
          >
            View All Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PAcceptedReports;