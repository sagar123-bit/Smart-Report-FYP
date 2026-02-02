import ReportDetailDrawer from '@/components/ReportDetailsDrawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DELETE_CRIME_REPORT } from '@/routes/serverEndpoint';
import { fetchAllCrimeReports } from '@/store/slices/getAllReports';
import axiosService from '@/utils/axiosService';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Eye, FileText, Filter, Loader2, MapPin, PlayCircle, Search, Trash2, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AReports = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const dispatch = useDispatch();

  const { reports } = useSelector(state => state?.allReports);
  
  const reportData = reports ? [...reports] : [];

  const provinces = [
    "Koshi",
    "Madesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim"
  ];

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'rejected', label: 'Rejected' }
  ];

  const filteredReports = reportData.filter(report => {
    let matchesSearch = true;
    let matchesFilter = true;
    let matchesDate = true;
    let matchesProvince = true;

    if (searchTerm) {
      matchesSearch = (
        report.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.crimeType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.locationAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      matchesFilter = report.status === activeFilter;
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

    if (selectedProvince !== 'all') {
      matchesProvince = report.province === selectedProvince;
    }

    return matchesSearch && matchesFilter && matchesDate && matchesProvince;
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <PlayCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatStatus = (status) => {
    return status.replace('-', ' ');
  };

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

  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedProvince('all');
    setActiveFilter('all');
    setCurrentPage(1);
  };

  const handleDeleteReport = async (reportId) => {
    if (deletingReportId) return;
    
    setDeletingReportId(reportId);
    try {
      const response = await axiosService.delete(`${DELETE_CRIME_REPORT}/${reportId}`, { withCredentials: true });
      if (response?.status === 200) {
        await dispatch(fetchAllCrimeReports());
        toast.success(response?.data?.message || "Report deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error(error?.response?.data?.message || "Failed to delete report");
    } finally {
      setDeletingReportId(null);
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

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Reports</h1>
        <p className="text-gray-600 mt-2">System-wide crime reports overview</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 bg-white border rounded-md p-2 flex-1">
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
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
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
                    ? reportData.length 
                    : reportData.filter(r => r.status === tab.id).length}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} reports
            {(searchTerm || startDate || endDate || selectedProvince !== 'all' || activeFilter !== 'all') && ' (filtered)'}
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Province</th>
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
                          {report.crimeType?.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{report.locationAddress}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-700">{report.province}</span>
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
                            disabled={deletingReportId === report._id}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {['pending', 'rejected'].includes(report.status) && (
                            <Button 
                              onClick={() => handleDeleteReport(report._id)} 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingReportId === report._id || deletingReportId}
                            >
                              {deletingReportId === report._id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              {deletingReportId === report._id ? 'Deleting...' : 'Delete'}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || startDate || endDate || selectedProvince !== 'all' || activeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No reports in the system yet'}
            </p>
            {(searchTerm || startDate || endDate || selectedProvince !== 'all' || activeFilter !== 'all') && (
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

export default AReports;
