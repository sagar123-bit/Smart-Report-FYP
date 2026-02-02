import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAllCrimeReports } from '@/store/slices/getAllReports';
import {
  CheckCircle,
  Clock,
  FileText,
  PlayCircle,
  ShieldCheck
} from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTooltip
} from 'victory';

const PDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.user);
  const { reports, loading: reportLoading } = useSelector(state => state?.allReports);
  
  useEffect(() => {
    dispatch(fetchAllCrimeReports());
  }, [dispatch]);
  
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const reportData = reports ? [...reports] : [];
  const userProvince = user?.province;
  
  const provinceReports = reportData.filter(report => report.province?.toUpperCase() === userProvince?.toUpperCase());
  
  const inProgressReports = provinceReports.filter(report => 
    report.status === "in-progress"
  );
  
  const resolvedReports = provinceReports.filter(report => 
    report.status === "resolved"
  );
  
  const pendingReports = provinceReports.filter(report => 
    report.status === "pending"
  );
  
  const totalReportsInProvince = provinceReports.length;
  
  const recentProvinceCases = [...provinceReports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(report => ({
      id: report.reportId,
      type: report.crimeType,
      location: report.locationAddress,
      status: report.status,
      time: new Date(report.createdAt).toLocaleDateString(),
      reporter: report.reportedBy?.userName
    }));
  
  const getMonthlyReports = () => {
    const monthlyData = new Array(12).fill(0);
    
    provinceReports.forEach(report => {
      const date = new Date(report.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        monthlyData[month]++;
      }
    });
    
    return months.map((month, index) => ({
      x: month,
      y: monthlyData[index]
    }));
  };
  
  const monthlyReportData = getMonthlyReports();
  
  const handleViewAllReports = () => {
    navigate('/policedashboard/allreports');
  };
  
  const handleStartInvestigation = () => {
    navigate('/policedashboard/acceptedreports');
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          Needs Action
        </span>;
      case "in-progress":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <PlayCircle className="h-3 w-3 mr-1" />
          In Progress
        </span>;
      case "resolved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolved
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };
  
  if (reportLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Police Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage cases from {userProvince || 'your province'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-5 w-5" />
              Total Cases
            </CardTitle>
            <CardDescription>In your province</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalReportsInProvince}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-5 w-5" />
              Accepted Cases
            </CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{inProgressReports.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-5 w-5" />
              Resolved Cases
            </CardTitle>
            <CardDescription>Successfully closed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{resolvedReports.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-5 w-5" />
              Needs Action
            </CardTitle>
            <CardDescription>Pending review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingReports.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Case Status Distribution</CardTitle>
            <CardDescription>Breakdown of cases in {userProvince}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalReportsInProvince > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-700">Needs Action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{pendingReports.length}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round((pendingReports.length / totalReportsInProvince) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{inProgressReports.length}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round((inProgressReports.length / totalReportsInProvince) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-700">Resolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{resolvedReports.length}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round((resolvedReports.length / totalReportsInProvince) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No cases to show distribution</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Reports ({currentYear})</CardTitle>
            <CardDescription>New cases in {userProvince}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {monthlyReportData.some(data => data.y > 0) ? (
                <VictoryChart
                  domainPadding={20}
                  padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
                >
                  <VictoryAxis
                    tickFormat={months}
                    style={{
                      tickLabels: { fontSize: 9, padding: 5 }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 9 }
                    }}
                  />
                  <VictoryBar
                    data={monthlyReportData}
                    style={{
                      data: { fill: "#3B82F6" }
                    }}
                    labels={({ datum }) => `${datum.y} case${datum.y !== 1 ? 's' : ''}`}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No case data available for this year</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="border-t border-gray-200 my-6"></div>
      
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Cases in {userProvince}</h2>
            <p className="text-gray-600">Latest 5 cases from your province</p>
          </div>
        </div>
        
        {recentProvinceCases.length === 0 ? (
          <Card className="border-dashed border-gray-300">
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent cases found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No recent cases in your province yet. Cases will appear here once reported.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reporter</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProvinceCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-sm">{caseItem.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {caseItem.type?.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 truncate max-w-[150px]">{caseItem.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{caseItem.reporter || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(caseItem.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{caseItem.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-12 gap-3 cursor-pointer"
            onClick={handleViewAllReports}
          >
            <FileText className="h-4 w-4" />
            View All Reports
          </Button>
          <Button 
            className="h-12 gap-3 cursor-pointer"
            onClick={handleStartInvestigation}
          >
            <PlayCircle className="h-4 w-4" />
            View In-Progress Investigation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDashboard;