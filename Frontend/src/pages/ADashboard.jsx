import React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryLegend,
  VictoryPie,
  VictoryLabel
} from 'victory';
import { FileText, Clock, User, Shield } from 'lucide-react';
import { Link } from 'react-router';

const ADashboard = () => {
  const provinceData = [
    { x: 'Koshi', y: 45 },
    { x: 'Madhesh', y: 32 },
    { x: 'Bagmati', y: 78 },
    { x: 'Gandaki', y: 25 },
    { x: 'Lumbini', y: 41 },
    { x: 'Sudurpaschim', y: 19 },
  ];

  const caseStatusData = [
    { x: 'Pending', y: 120, color: '#F59E0B' },
    { x: 'In Progress', y: 85, color: '#3B82F6' },
    { x: 'Resolved', y: 65, color: '#10B981' },
  ];

  const userData = [
    { x: 'Citizens', y: 1560 },
    { x: 'Police Officers', y: 234 },
  ];

  const crimeTypeData = [
    { x: 'Theft', y: 45 },
    { x: 'Assault', y: 32 },
    { x: 'Fraud', y: 28 },
    { x: 'Vandalism', y: 19 },
    { x: 'Other', y: 36 },
  ];

  const recentCases = [
    { id: 'CASE-001', type: 'Theft', location: 'Kathmandu', status: 'Pending', time: '2 hours ago' },
    { id: 'CASE-002', type: 'Assault', location: 'Pokhara', status: 'In Progress', time: '5 hours ago' },
    { id: 'CASE-003', type: 'Fraud', location: 'Biratnagar', status: 'Resolved', time: '1 day ago' },
    { id: 'CASE-004', type: 'Vandalism', location: 'Butwal', status: 'Pending', time: '2 days ago' },
    { id: 'CASE-005', type: 'Theft', location: 'Dharan', status: 'In Progress', time: '3 days ago' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System-wide analytics and user management</p>
      </div>

      <div className="border-t border-gray-200"></div>

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
                data={provinceData}
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

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Users Distribution</h2>
          <div className="h-80">
            <VictoryChart
              domainPadding={30}
              padding={{ top: 40, bottom: 60, left: 60, right: 40 }}
            >
              <VictoryAxis
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
                data={userData}
                style={{
                  data: { fill: "#10B981" }
                }}
                labels={({ datum }) => datum.y}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLegend
                x={50}
                y={10}
                orientation="horizontal"
                gutter={20}
                data={[{ name: "Users", symbol: { fill: "#10B981" } }]}
              />
            </VictoryChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Crime Types Distribution</h2>
          <div className="h-80">
            <VictoryChart
              domainPadding={20}
              padding={{ top: 40, bottom: 60, left: 60, right: 40 }}
            >
              <VictoryAxis
                tickFormat={(tick) => tick}
                style={{
                  tickLabels: { fontSize: 10, padding: 5, angle: -45 }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fontSize: 10 }
                }}
              />
              <VictoryBar
                data={crimeTypeData}
                style={{
                  data: { fill: "#8B5CF6" }
                }}
                labels={({ datum }) => `${datum.y} cases`}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLegend
                x={50}
                y={10}
                orientation="horizontal"
                gutter={20}
                data={[{ name: "Cases", symbol: { fill: "#8B5CF6" } }]}
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
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
                      caseItem.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      caseItem.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caseItem.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                      {caseItem.status === 'In Progress' && <User className="h-3 w-3 mr-1" />}
                      {caseItem.status === 'Resolved' && <Shield className="h-3 w-3 mr-1" />}
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