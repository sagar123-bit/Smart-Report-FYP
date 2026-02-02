import { AlertCircle, Clock, FileText, Shield, ShieldCheck, User, UserCheck, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryPie,
  VictoryTooltip
} from 'victory';

const ADashboard = () => {
  const { users, loading: userLoading } = useSelector(state => state?.allUsers);
  const { reports, loading: reportLoading } = useSelector(state => state?.allReports);

  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const userData = users ? [...users] : [];
  const reportData = reports ? [...reports] : [];

  const filteredUsers = userData.filter(user => 
    user.status === "active" && 
    (user.userType === "citizen" || 
     (user.userType === "police" && user.policeData?.status === "verified"))
  );

  const allReports = reportData;

  const citizens = filteredUsers.filter(user => user.userType === "citizen");
  const police = filteredUsers.filter(user => user.userType === "police");
  const totalUsers = citizens.length + police.length;

  const pendingReports = allReports.filter(report => report.status === "pending");
  const inProgressReports = allReports.filter(report => report.status === "in-progress");
  const resolvedReports = allReports.filter(report => report.status === "resolved");
  const totalReports = allReports.length;

  const provinces = ["Koshi", "Madesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
  
  const provinceReports = provinces.map(province => ({
    x: province,
    y: allReports.filter(report => report.province === province).length
  }));

  const caseStatusData = [
    { x: 'Pending', y: pendingReports.length, color: '#F59E0B' },
    { x: 'In Progress', y: inProgressReports.length, color: '#3B82F6' },
    { x: 'Resolved', y: resolvedReports.length, color: '#10B981' },
  ];

  const getMonthlyRegistrations = () => {
    const citizenMonthlyData = new Array(12).fill(0);
    const policeMonthlyData = new Array(12).fill(0);
    
    filteredUsers.forEach(user => {
      const date = new Date(user.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        if (user.userType === "citizen") {
          citizenMonthlyData[month]++;
        } else if (user.userType === "police") {
          policeMonthlyData[month]++;
        }
      }
    });
    
    const citizenData = months.map((month, index) => ({
      x: month,
      y: citizenMonthlyData[index]
    }));
    
    const policeData = months.map((month, index) => ({
      x: month,
      y: policeMonthlyData[index]
    }));
    
    return { citizenData, policeData };
  };

  const { citizenData, policeData } = getMonthlyRegistrations();

  const recentCases = [...allReports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(report => ({
      id: report.reportId,
      type: report.crimeType,
      location: report.locationAddress,
      status: report.status,
      time: new Date(report.createdAt).toLocaleDateString(),
      userId: report.reportedBy?.userId
    }));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System-wide analytics and user management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citizens</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{citizens.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Police Officers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{police.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalReports}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cases by Province</h2>
          <div className="h-80">
            <VictoryChart
              domainPadding={20}
              padding={{ top: 40, bottom: 60, left: 60, right: 40 }}
            >
              <VictoryAxis
                tickFormat={(tick) => tick}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fontSize: 10 }
                }}
              />
              <VictoryBar
                data={provinceReports}
                style={{
                  data: { fill: "#3B82F6" }
                }}
                labels={({ datum }) => `${datum.y} cases`}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLegend
                x={50}
                y={10}
                orientation="horizontal"
                gutter={20}
                data={[{ name: "Cases", symbol: { fill: "#3B82F6" } }]}
              />
            </VictoryChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Status Distribution</h2>
          <div className="h-80">
            <VictoryPie
              data={caseStatusData}
              colorScale={["#F59E0B", "#3B82F6", "#10B981"]}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              labelRadius={({ innerRadius }) => innerRadius + 50}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 10, fill: "white" }}
                  textAnchor="middle"
                />
              }
              innerRadius={50}
              padAngle={2}
              animate={{
                duration: 1000
              }}
              padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Registration ({currentYear})</h2>
          <div className="h-80">
            <VictoryChart
              domainPadding={20}
              padding={{ top: 40, bottom: 60, left: 60, right: 40 }}
            >
              <VictoryAxis
                tickFormat={months}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fontSize: 10 }
                }}
              />
              <VictoryLine
                data={citizenData}
                style={{
                  data: { stroke: "#3B82F6", strokeWidth: 3 }
                }}
                labels={({ datum }) => `${datum.y} citizen${datum.y !== 1 ? 's' : ''}`}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={policeData}
                style={{
                  data: { stroke: "#8B5CF6", strokeWidth: 3 }
                }}
                labels={({ datum }) => `${datum.y} police officer${datum.y !== 1 ? 's' : ''}`}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLegend
                x={50}
                y={10}
                orientation="horizontal"
                gutter={20}
                data={[
                  { name: "Citizens", symbol: { fill: "#3B82F6" } },
                  { name: "Police", symbol: { fill: "#8B5CF6" } }
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Case ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{caseItem.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {caseItem.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{caseItem.location}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      caseItem.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caseItem.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {caseItem.status === 'in-progress' && <User className="h-3 w-3 mr-1" />}
                      {caseItem.status === 'resolved' && <Shield className="h-3 w-3 mr-1" />}
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{caseItem.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link to="/admindashboard/adminreports" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All Reports →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ADashboard;