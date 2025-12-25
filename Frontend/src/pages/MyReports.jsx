import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, FileText, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const MyReports = () => {
  const navigate = useNavigate();
  const userState = useSelector(state => state?.user);
  const { user } = userState || {};
  
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const demoReports = [
    {
      id: "SR-001",
      title: "Theft at Market",
      crimeType: "Theft/Burglary",
      date: "2025-12-01",
      time: "14:30",
      location: "Birtamod Market",
      status: "pending",
      description: "Wallet stolen while shopping",
      assignedTo: "Not assigned",
      priority: "medium"
    },
    {
      id: "SR-002",
      title: "Traffic Accident",
      crimeType: "Traffic Violation",
      date: "2025-12-05",
      time: "09:15",
      location: "Itahari Chowk",
      status: "in-progress",
      description: "Car hit and run incident",
      assignedTo: "Inspector Sharma",
      priority: "high"
    },
    {
      id: "SR-003",
      title: "Online Fraud",
      crimeType: "Cyber Crime",
      date: "2025-11-28",
      time: "16:45",
      location: "Online Transaction",
      status: "resolved",
      description: "Online payment scam",
      assignedTo: "Cyber Crime Unit",
      priority: "low"
    },
    {
      id: "SR-004",
      title: "Harassment Case",
      crimeType: "Harassment",
      date: "2025-12-03",
      time: "19:20",
      location: "Local Park",
      status: "pending",
      description: "Verbal harassment incident",
      assignedTo: "Not assigned",
      priority: "medium"
    },
    {
      id: "SR-005",
      title: "Property Damage",
      crimeType: "Property Damage",
      date: "2025-11-25",
      time: "11:00",
      location: "Residential Area",
      status: "resolved",
      description: "Vandalism to private property",
      assignedTo: "Sub-Inspector Rai",
      priority: "medium"
    }
  ];

  const stats = {
    total: demoReports.length,
    pending: demoReports.filter(r => r.status === "pending").length,
    inProgress: demoReports.filter(r => r.status === "in-progress").length,
    resolved: demoReports.filter(r => r.status === "resolved").length,
  };

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setReports(demoReports);
      setIsLoading(false);
    };

    loadReports();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Low</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const viewReportDetails = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  const getFilteredReports = (status) => {
    if (status === "all") return reports;
    return reports.filter(report => report.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
          <p className="text-gray-600">Track and manage all your submitted crime reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Reports</CardTitle>
                <CardDescription>
                  Manage and track the status of your submitted reports
                </CardDescription>
              </div>
              <Button
                onClick={() => navigate("/reportcrime")}
                className="cursor-pointer"
              >
                + Create New Report
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {["all", "pending", "in-progress", "resolved"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your reports...</p>
                    </div>
                  ) : (
                    <>
                      {getFilteredReports(tab).length === 0 ? (
                        <div className="text-center py-12">
                          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {tab === "all" ? (
                              <FileText className="h-8 w-8 text-gray-400" />
                            ) : tab === "pending" ? (
                              <Clock className="h-8 w-8 text-gray-400" />
                            ) : tab === "in-progress" ? (
                              <AlertCircle className="h-8 w-8 text-gray-400" />
                            ) : (
                              <CheckCircle className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {tab === "all" 
                              ? "No reports found" 
                              : `No ${tab.replace('-', ' ')} reports`
                            }
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {tab === "all" 
                              ? "You haven't filed any reports yet." 
                              : `You don't have any ${tab.replace('-', ' ')} reports.`
                            }
                          </p>
                          {tab === "all" && (
                            <Button
                              onClick={() => navigate("/reportcrime")}
                              className="cursor-pointer"
                            >
                              + Create Your First Report
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Report ID</TableHead>
                                <TableHead>Crime Type</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getFilteredReports(tab)
                                .filter(report => 
                                  searchTerm === "" ||
                                  report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  report.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  report.description.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((report) => (
                                  <TableRow key={report.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{report.id}</TableCell>
                                    <TableCell>{report.crimeType}</TableCell>
                                    <TableCell>
                                      <div>
                                        <div>{formatDate(report.date)}</div>
                                        <div className="text-sm text-gray-500">{report.time}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                                    <TableCell>{report.assignedTo}</TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => viewReportDetails(report.id)}
                                        className="cursor-pointer"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyReports;