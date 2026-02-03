import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock as ClockIcon,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  PhoneCall,
  Shield,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReportDetailDrawer = ({ open, onOpenChange, report }) => {
  const [activeImage, setActiveImage] = useState(0);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

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

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const openImageInNewTab = (url) => {
    window.open(`${serverUrl}/${url}`, '_blank');
  };

  if (!report) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5" />
                  Report: {report.reportId}
                </DrawerTitle>
                <DrawerDescription>
                  Complete details about the crime report
                </DrawerDescription>
              </div>
              <DrawerClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </div>
            <div className="mt-2">
              {getStatusBadge(report.status)}
            </div>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto max-h-[calc(95vh-140px)]">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 w-full sticky top-0 bg-white z-10">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Incident Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crime Type:</span>
                        <span className="font-medium capitalize">{report.crimeType?.replace(/-/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Incident Date:</span>
                        <span className="font-medium">{formatDate(report.incidentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Incident Time:</span>
                        <span className="font-medium">{report.incidentTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right">{report.locationAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Province:</span>
                        <span className="font-medium">{report.province || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coordinates:</span>
                        <span className="font-medium">
                          {report.coordinates?.latitude?.toFixed(6)}, {report.coordinates?.longitude?.toFixed(6)}
                        </span>
                      </div>
                      {report.coordinates?.latitude && report.coordinates?.longitude && (
                        <div className="h-48 bg-gray-200 rounded-lg overflow-hidden relative z-0">
                          <MapContainer
                            center={[report.coordinates.latitude, report.coordinates.longitude]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[report.coordinates.latitude, report.coordinates.longitude]}>
                              <Popup>
                                Crime Location<br />
                                {report.locationAddress}<br />
                                Province: {report.province}
                              </Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Case Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Report ID:</span>
                        <span className="font-medium">{report.reportId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          <span className="capitalize">{report.status?.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reported On:</span>
                        <span className="font-medium">{formatDate(report.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(report.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </h3>
                    <div className="max-h-40 overflow-y-auto pr-2">
                      <p className="text-gray-700 whitespace-pre-line">{report.description || "No description provided"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Evidence Files
                    <Badge variant="outline" className="ml-2">
                      {report.evidenceUrls?.length || 0} files
                    </Badge>
                  </h3>
                  
                  {report.evidenceUrls?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={`${serverUrl}/${report.evidenceUrls[activeImage]}`}
                            alt={`Evidence ${activeImage + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => openImageInNewTab(report.evidenceUrls[activeImage])}
                        >
                          <Maximize2 className="h-4 w-4 text-black" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                        {report.evidenceUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <button
                              onClick={() => setActiveImage(index)}
                              className={`h-20 w-full rounded-lg overflow-hidden border-2 ${
                                activeImage === index 
                                  ? 'border-blue-500' 
                                  : 'border-transparent'
                              }`}
                            >
                              <img 
                                src={`${serverUrl}/${url}`}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                              onClick={() => openImageInNewTab(url)}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-600">
                          {activeImage + 1} of {report.evidenceUrls.length}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const prev = activeImage === 0 ? report.evidenceUrls.length - 1 : activeImage - 1;
                              setActiveImage(prev);
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const next = activeImage === report.evidenceUrls.length - 1 ? 0 : activeImage + 1;
                              setActiveImage(next);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3" />
                      <p>No evidence files uploaded</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="people" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Reporter Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        {report.reportedBy?.userImage ? (
                          <img 
                            src={`${serverUrl}/${report.reportedBy.userImage}`}
                            alt={report.reportedBy.userName}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{report.reportedBy?.userName || "Unknown"}</p>
                          <p className="text-sm text-gray-600 capitalize">{report.reportedBy?.userType || "Citizen"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{report.reportedBy?.email || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{report.reportedBy?.phoneNumber || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {report.reportedBy?.district || "Unknown"}, {report.reportedBy?.province || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Assigned Officer
                    </h3>
                    {report.assignedTo ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          {report.assignedTo?.userImage ? (
                            <img 
                              src={`${serverUrl}/${report.assignedTo.userImage}`}
                              alt={report.assignedTo.userName}
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{report.assignedTo?.userName || "Unknown Officer"}</p>
                            <p className="text-sm text-gray-600">Police Officer</p>
                            {report.assignedTo?.policeData && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {report.assignedTo.policeData.rank}
                                </Badge>
                                <span className="text-xs text-gray-500">{report.assignedTo.policeData.station}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned Status:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </div>
                          {report.acceptedAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accepted On:</span>
                              <span className="font-medium">{formatDate(report.acceptedAt)}</span>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <PhoneCall className="h-4 w-4" />
                            Contact Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{report.assignedTo?.email || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{report.assignedTo?.phoneNumber || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {report.assignedTo?.district || "Unknown"}, {report.assignedTo?.province || "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3" />
                        <p>No officer assigned yet</p>
                        <p className="text-sm mt-1">This case is awaiting assignment</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DrawerFooter className="border-t sticky bottom-0 bg-white">
            <DrawerClose asChild>
              <Button className="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ReportDetailDrawer;
