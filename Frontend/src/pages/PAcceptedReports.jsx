import ReportDetailDrawer from '@/components/ReportDetailsDrawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CREATE_CRIME_REPORT_ROOM, UPDATE_REPORT_STATUS } from '@/routes/serverEndpoint';
import { fetchAllCrimeReports } from '@/store/slices/getAllReports';
import axiosService from '@/utils/axiosService';
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  PlayCircle,
  Search,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const PAcceptedReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state?.user);
  const { reports, loading: reportLoading } = useSelector(state => state?.allReports);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCrimeType, setSelectedCrimeType] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [updatingReportId, setUpdatingReportId] = useState(null);
  const [contacting, setContacting] = useState({});
  
  useEffect(() => {
    dispatch(fetchAllCrimeReports());
  }, []);
  
  const reportData = reports ? [...reports] : [];
  const userId = user?._id;
  
  const assignedReports = reportData.filter(report => 
    report.assignedTo?._id === userId && report.status !== 'rejected'
  );
  
  const totalAssigned = assignedReports.length;
  const inProgressReports = assignedReports.filter(report => report.status === 'in-progress');
  const resolvedReports = assignedReports.filter(report => report.status === 'resolved');
  
  const uniqueCrimeTypes = [...new Set(assignedReports.map(report => report.crimeType))].sort();
  
  const filteredReports = assignedReports.filter(report => {
    let matchesSearch = true;
    let matchesDate = true;
    let matchesCrimeType = true;
    let matchesStatus = true;
    
    if (searchTerm) {
      matchesSearch = (
        report.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.crimeType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.locationAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      matchesDate = matchesDate && new Date(report.incidentDate) >= start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(report.incidentDate) <= end;
    }
    
    if (selectedCrimeType !== 'all') {
      matchesCrimeType = report.crimeType === selectedCrimeType;
    }
    
    if (activeFilter === 'in-progress') {
      matchesStatus = report.status === 'in-progress';
    } else if (activeFilter === 'resolved') {
      matchesStatus = report.status === 'resolved';
    }
    
    return matchesSearch && matchesDate && matchesCrimeType && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  
  const filterTabs = [
    { id: 'all', label: 'All Assigned' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' }
  ];
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <PlayCircle className="h-3 w-3 mr-1" />
          In Progress
        </Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolved
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedCrimeType('all');
    setActiveFilter('all');
    setCurrentPage(1);
  };
  
  const handleStatusUpdate = async (reportId, newStatus) => {
    if (updatingReportId) return;
    
    setUpdatingReportId(reportId);
    try {
      const response = await axiosService.patch(
        `${UPDATE_REPORT_STATUS}/${reportId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      if (response?.status === 200) {
        await dispatch(fetchAllCrimeReports());
        toast.success(`Report marked as resolved successfully`);
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error(error?.response?.data?.message || "Failed to update report status");
    } finally {
      setUpdatingReportId(null);
    }
  };

  const handleContactReporter = async (reportId, reporter) => {
    if (!user || !reporter) {
      toast.error("Unable to contact reporter");
      return;
    }

    setContacting(prev => ({ ...prev, [reportId]: true }));
    try {
      const response = await axiosService.post(
        CREATE_CRIME_REPORT_ROOM,
        {
          otherUserId: reporter._id,
          reportId: reportId,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || "Chat room created successfully!");
        navigate(`/policedashboard/chats?room=${response.data.room._id}`);
      }
    } catch (error) {
      console.error("Contact reporter error:", error);
      toast.error(error.response?.data?.message || "Failed to create chat room");
    } finally {
      setContacting(prev => ({ ...prev, [reportId]: false }));
    }
  };
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const formatCrimeType = (crimeType) => {
    return crimeType.split('/').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('/').replace(/-/g, ' ');
  };
  
  if (reportLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }
  
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
            <div className="text-4xl font-bold text-gray-900">{totalAssigned}</div>
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
            <div className="text-4xl font-bold text-gray-900">{inProgressReports.length}</div>
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
            <div className="text-4xl font-bold text-gray-900">{resolvedReports.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="border-t border-gray-200 my-6"></div>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Report ID, crime type, location, reporter..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border rounded-md p-2">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Input 
                type="date" 
                placeholder="From"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
              <span className="text-gray-400 text-sm flex-shrink-0">to</span>
              <Input 
                type="date" 
                placeholder="To"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
          </div>
          
          <select 
            value={selectedCrimeType}
            onChange={(e) => {
              setSelectedCrimeType(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-2 text-sm bg-white h-full"
          >
            <option value="all">All Crime Types</option>
            {uniqueCrimeTypes.map((crimeType) => (
              <option key={crimeType} value={crimeType}>
                {formatCrimeType(crimeType)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "outline"}
                className="px-4"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setCurrentPage(1);
                }}
              >
                {tab.label}
                <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {tab.id === 'all' 
                    ? assignedReports.length 
                    : assignedReports.filter(r => r.status === tab.id).length}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} reports
            {(searchTerm || startDate || endDate || selectedCrimeType !== 'all' || activeFilter !== 'all') && ' (filtered)'}
          </p>
          <Button variant="outline" className="gap-2" onClick={handleClearFilters}>
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-6"></div>
      
      {currentReports.length > 0 ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Report ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Crime Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reporter</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReports.map((report) => (
                    <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{report.reportId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatCrimeType(report.crimeType)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{report.locationAddress}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[150px]">{report.reportedBy?.userName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{report.reportedBy?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(report.incidentDate)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewReportDetails(report)}
                            disabled={updatingReportId === report._id}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactReporter(report._id, report.reportedBy)}
                            disabled={contacting[report._id] || updatingReportId === report._id}
                            className="cursor-pointer"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {contacting[report._id] ? 'Creating...' : 'Contact'}
                          </Button>
                          
                          {report.status === 'in-progress' && (
                            <Button 
                              onClick={() => handleStatusUpdate(report._id, 'resolved')} 
                              variant="default" 
                              size="sm"
                              disabled={updatingReportId === report._id || updatingReportId}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {updatingReportId === report._id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              {updatingReportId === report._id ? 'Processing...' : 'Mark Resolved'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4 px-2">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((number, index) => (
                    number === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
                    ) : (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Button>
                    )
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {reportsPerPage} per page
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted cases found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || startDate || endDate || selectedCrimeType !== 'all' || activeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Accept cases from the reports page to start investigating'}
            </p>
            {(searchTerm || startDate || endDate || selectedCrimeType !== 'all' || activeFilter !== 'all') && (
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <ReportDetailDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        report={selectedReport}
      />
    </div>
  );
};

export default PAcceptedReports;