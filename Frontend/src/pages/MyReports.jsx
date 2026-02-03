import ReportDetailDrawer from '@/components/ReportDetailsDrawer';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Clock, Edit, Eye, FileText, MessageSquare, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import axiosService from '@/utils/axiosService';
import { DELETE_CRIME_REPORT, CREATE_CRIME_REPORT_ROOM } from '@/routes/serverEndpoint';
import { fetchAllCrimeReports } from '@/store/slices/getAllReports';
import { toast } from 'react-toastify';

const MyReports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector(state => state?.user);
  const crimeReportsState = useSelector(state=>state?.allReports);
  const { user } = userState || {};
  const {reports: crimeReports = [], loading} = crimeReportsState || {};
  
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [contacting, setContacting] = useState({});
  const itemsPerPage = 10;

  const userReports = crimeReports?.filter(report => 
    report.reportedBy?._id === user?._id || 
    report.reportedBy?.userId === user?.userId
  ) || [];

  const stats = {
    total: userReports.length,
    pending: userReports.filter(r => r.status === "pending").length,
    inProgress: userReports.filter(r => r.status === "in-progress").length,
    resolved: userReports.filter(r => r.status === "resolved").length,
    rejected: userReports.filter(r => r.status === "rejected").length,
  };

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setReports(userReports);
      setFilteredReports(userReports);
      setIsLoading(false);
    };

    if (crimeReports) {
      loadReports();
    }
  }, [crimeReports, user]);

  useEffect(() => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(report => 
        (report.reportId && report.reportId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.crimeType && report.crimeType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.locationAddress && report.locationAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(report => 
        new Date(report.incidentDate) >= new Date(dateRange.start)
      );
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(report => 
        new Date(report.incidentDate) <= endDate
      );
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchTerm, dateRange, reports]);

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (status) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Medium</Badge>;
      case "in-progress":
        return <Badge variant="destructive">High</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Low</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">N/A</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const getFilteredReports = (status) => {
    if (status === "all") return filteredReports;
    return filteredReports.filter(report => report.status === status);
  };

  const getAssignedTo = (report) => {
    if (report.assignedTo) return `Officer ${report.assignedTo.userName}`;
    return "Not assigned";
  };

  const handleUpdateReport = (reportId) => {
    navigate(`/reportcrime?edit=${reportId}`);
  };

  const handleDeleteReport = async (reportId) => {
    try{
      const response = await axiosService.delete(`${DELETE_CRIME_REPORT}/${reportId}`,{withCredentials:true});
      if(response?.status===200){
        await dispatch(fetchAllCrimeReports());
        toast.success(response?.data?.message||"Report deleted successfully");
      }
    }
    catch(error){
      console.error("Error deleting report:", error);
      toast.error(error?.response?.data?.message || "Failed to delete report");
    }
  };

  const handleContactPolice = async (reportId, assignedTo) => {
    if (!user || !assignedTo) {
      toast.error("No police officer assigned to this report");
      return;
    }

    setContacting(prev => ({ ...prev, [reportId]: true }));
    try {
      const response = await axiosService.post(
        CREATE_CRIME_REPORT_ROOM,
        {
          otherUserId: assignedTo._id,
          reportId: reportId,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || "Chat room created successfully!");
        navigate(`/report-chat?room=${response.data.room._id}`);
      }
    } catch (error) {
      console.error("Contact police error:", error);
      toast.error(error.response?.data?.message || "Failed to create chat room");
    } finally {
      setContacting(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const clearDateFilter = () => {
    setDateRange({ start: '', end: '' });
  };

  const totalPages = Math.ceil(getFilteredReports("all").length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = getFilteredReports("all").slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      let start = currentPage - half;
      let end = currentPage + half;
      
      if (start < 1) {
        start = 1;
        end = maxPagesToShow;
      }
      
      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxPagesToShow + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
            <p className="text-gray-600">Track and manage all your submitted crime reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
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
                    <TabsTrigger value="all">All ({filteredReports.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="border rounded px-3 py-1 text-sm"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="border rounded px-3 py-1 text-sm"
                        />
                      </div>
                      {(dateRange.start || dateRange.end) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearDateFilter}
                          className="h-8"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
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
                </div>

                {["all", "pending", "in-progress", "resolved", "rejected"].map((tab) => (
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
                              ) : tab === "resolved" ? (
                                <CheckCircle className="h-8 w-8 text-gray-400" />
                              ) : (
                                <XCircle className="h-8 w-8 text-gray-400" />
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
                          <>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Report ID</TableHead>
                                    <TableHead>Crime Type</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tab === "all" 
                                    ? currentReports.map((report) => (
                                        <TableRow key={report._id} className="hover:bg-gray-50">
                                          <TableCell className="font-medium">{report.reportId}</TableCell>
                                          <TableCell className="capitalize">{report.crimeType?.replace(/-/g, ' ')}</TableCell>
                                          <TableCell>
                                            <div>
                                              <div>{formatDate(report.incidentDate)}</div>
                                              <div className="text-sm text-gray-500">{report.incidentTime}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{report.locationAddress}</TableCell>
                                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                                          <TableCell>{getPriorityBadge(report.status)}</TableCell>
                                          <TableCell>{getAssignedTo(report)}</TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => viewReportDetails(report)}
                                                className="cursor-pointer"
                                              >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                              </Button>
                                              {(report.status === "in-progress" || report.status === "resolved") && report.assignedTo && (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleContactPolice(report._id, report.assignedTo)}
                                                  disabled={contacting[report._id]}
                                                  className="cursor-pointer"
                                                >
                                                  <MessageSquare className="h-4 w-4 mr-2" />
                                                  {contacting[report._id] ? 'Creating...' : 'Contact'}
                                                </Button>
                                              )}
                                              {report.status === "pending" && (
                                                <>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateReport(report._id)}
                                                    className="cursor-pointer"
                                                  >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                  </Button>
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteReport(report._id)}
                                                    className="cursor-pointer"
                                                  >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                  </Button>
                                                </>
                                              )}
                                              {report.status === "rejected" && (
                                                <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleDeleteReport(report._id)}
                                                  className="cursor-pointer"
                                                >
                                                  <Trash2 className="h-4 w-4 mr-2" />
                                                  Delete
                                                </Button>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    : getFilteredReports(tab).map((report) => (
                                        <TableRow key={report._id} className="hover:bg-gray-50">
                                          <TableCell className="font-medium">{report.reportId}</TableCell>
                                          <TableCell className="capitalize">{report.crimeType?.replace(/-/g, ' ')}</TableCell>
                                          <TableCell>
                                            <div>
                                              <div>{formatDate(report.incidentDate)}</div>
                                              <div className="text-sm text-gray-500">{report.incidentTime}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{report.locationAddress}</TableCell>
                                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                                          <TableCell>{getPriorityBadge(report.status)}</TableCell>
                                          <TableCell>{getAssignedTo(report)}</TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => viewReportDetails(report)}
                                                className="cursor-pointer"
                                              >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                              </Button>
                                              {(tab === "in-progress" || tab === "resolved") && report.assignedTo && (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleContactPolice(report._id, report.assignedTo)}
                                                  disabled={contacting[report._id]}
                                                  className="cursor-pointer"
                                                >
                                                  <MessageSquare className="h-4 w-4 mr-2" />
                                                  {contacting[report._id] ? 'Creating...' : 'Contact'}
                                                </Button>
                                              )}
                                              {tab === "pending" && (
                                                <>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateReport(report._id)}
                                                    className="cursor-pointer"
                                                  >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                  </Button>
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteReport(report._id)}
                                                    className="cursor-pointer"
                                                  >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                  </Button>
                                                </>
                                              )}
                                              {tab === "rejected" && (
                                                <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleDeleteReport(report._id)}
                                                  className="cursor-pointer"
                                                >
                                                  <Trash2 className="h-4 w-4 mr-2" />
                                                  Delete
                                                </Button>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                  }
                                </TableBody>
                              </Table>
                            </div>

                            {tab === "all" && totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600">
                                  Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer"
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                  </Button>
                                  {getPageNumbers().map((page) => (
                                    <Button
                                      key={page}
                                      variant={currentPage === page ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => goToPage(page)}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </Button>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="cursor-pointer"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
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

      {selectedReport && (
        <ReportDetailDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          report={selectedReport}
        />
      )}
    </>
  );
};

export default MyReports;