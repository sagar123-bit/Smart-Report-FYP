import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import axiosService from "@/utils/axiosService";
import { CREATE_CRIME_REPORT } from "@/routes/serverEndpoint";
import { X, Upload, File, Image, Video, FileText } from 'lucide-react';

const ReportCrime = () => {
  const navigate = useNavigate();
  const userData = useSelector(state => state?.user?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    crimeType: "",
    description: "",
    incidentDate: "",
    incidentTime: "",
    locationAddress: "",
    latitude: "",
    longitude: ""
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const crimeTypes = [
    { label: "Theft/Burglary", value: "theft/burglary" },
    { label: "Assault", value: "assault" },
    { label: "Fraud/Scam", value: "fraud/scam" },
    { label: "Harassment", value: "harassment" },
    { label: "Cyber Crime", value: "cyber-crime" },
    { label: "Drug Related", value: "drug-related" },
    { label: "Domestic Violence", value: "domestic-violence" },
    { label: "Public Disorder", value: "public-disorder" },
    { label: "Traffic Violation", value: "traffic-violation" },
    { label: "Property Damage", value: "property-damage" },
    { label: "Other", value: "other" }
  ];

  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.warn("Geolocation is not supported by your browser");
      setDefaultIthariLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
        
        localStorage.setItem('locationPermission', 'granted');
        localStorage.setItem('userLatitude', latitude.toString());
        localStorage.setItem('userLongitude', longitude.toString());
        
        toast.success("Your location detected successfully!");
        updateMapMarker(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        localStorage.setItem('locationPermission', 'denied');
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.warn("Location permission denied. Using default Ithari location.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.warn("Location information unavailable. Using default Ithari location.");
            break;
          case error.TIMEOUT:
            toast.warn("Location request timed out. Using default Ithari location.");
            break;
          default:
            toast.warn("Unable to get your location. Using default Ithari location.");
        }
        
        setDefaultIthariLocation();
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const setDefaultIthariLocation = () => {
    const defaultLat = "26.663547";
    const defaultLng = "87.274946";
    
    setFormData(prev => ({
      ...prev,
      latitude: defaultLat,
      longitude: defaultLng
    }));
    
    if (mapRef.current && markerRef.current) {
      updateMapMarker(parseFloat(defaultLat), parseFloat(defaultLng));
    }
  };

  const updateMapMarker = (lat, lng) => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      
      const newMarker = window.L.marker([lat, lng])
        .addTo(mapRef.current)
        .bindPopup('Crime Location')
        .openPopup();

      markerRef.current = newMarker;
      mapRef.current.setView([lat, lng], 13);
    }
  };

  const initializeMap = async (lat, lng) => {
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const mapInstance = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    const initialMarker = L.marker([lat, lng])
      .addTo(mapInstance)
      .bindPopup('Crime Location')
      .openPopup();

    markerRef.current = initialMarker;

    mapInstance.on('click', (e) => {
      const { lat: clickedLat, lng: clickedLng } = e.latlng;
      
      setFormData(prev => ({
        ...prev,
        latitude: clickedLat.toString(),
        longitude: clickedLng.toString()
      }));

      if (markerRef.current) {
        mapInstance.removeLayer(markerRef.current);
      }

      const newMarker = L.marker([clickedLat, clickedLng])
        .addTo(mapInstance)
        .bindPopup('Crime Location')
        .openPopup();

      markerRef.current = newMarker;
      mapInstance.setView([clickedLat, clickedLng], 13);
    });

    mapRef.current = mapInstance;
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    setFormData(prev => ({
      ...prev,
      incidentDate: today,
      incidentTime: now
    }));

    const locationPermission = localStorage.getItem('locationPermission');
    const savedLat = localStorage.getItem('userLatitude');
    const savedLng = localStorage.getItem('userLongitude');

    if (locationPermission === 'granted' && savedLat && savedLng) {
      setFormData(prev => ({
        ...prev,
        latitude: savedLat,
        longitude: savedLng
      }));
      setLocationLoading(false);
    } else if (locationPermission === 'denied') {
      toast.info("Using default Ithari location. You can click on map to select location.");
      setDefaultIthariLocation();
      setLocationLoading(false);
    } else {
      const askForLocation = () => {
        if (window.confirm("Allow SmartReport to access your location for accurate crime reporting?")) {
          getUserLocation();
        } else {
          localStorage.setItem('locationPermission', 'denied');
          toast.info("Using default Ithari location. You can click on map to select location.");
          setDefaultIthariLocation();
          setLocationLoading(false);
        }
      };

      setTimeout(() => {
        askForLocation();
      }, 500);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (formData.latitude && formData.longitude && !mapRef.current) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      initializeMap(lat, lng);
    }
  }, [formData.latitude, formData.longitude]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (evidenceFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) exceed 10MB limit: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setEvidenceFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <File className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!userData?._id) {
      toast.error("You must be logged in to submit a report");
      setIsLoading(false);
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map");
      setIsLoading(false);
      return;
    }

    if (!formData.crimeType) {
      toast.error("Please select a crime type");
      setIsLoading(false);
      return;
    }

    if (!formData.description) {
      toast.error("Please provide a description");
      setIsLoading(false);
      return;
    }

    if (!formData.incidentDate || !formData.incidentTime) {
      toast.error("Please provide date and time of incident");
      setIsLoading(false);
      return;
    }

    if (!formData.locationAddress) {
      toast.error("Please provide location address");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append('crimeType', formData.crimeType);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('incidentDate', formData.incidentDate);
    formDataToSend.append('incidentTime', formData.incidentTime);
    formDataToSend.append('locationAddress', formData.locationAddress);
    formDataToSend.append('latitude', formData.latitude);
    formDataToSend.append('longitude', formData.longitude);
    
    evidenceFiles.forEach((file, index) => {
      formDataToSend.append('evidences', file);
    });

    try {
      const response = await axiosService.post(CREATE_CRIME_REPORT, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      toast.success(response?.data?.message || "Report submitted successfully!");
      
      setEvidenceFiles([]);
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
      
      setFormData({
        crimeType: "",
        description: "",
        incidentDate: today,
        incidentTime: now,
        locationAddress: "",
        latitude: "",
        longitude: ""
      });
      
      navigate("/myreport");
    } catch (error) {
      console.log("Report submission error:", error);
      toast.error(
        error?.response?.data?.message || 
        "Failed to submit report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergency = () => {
    toast.info("For Emergency, please call 100 (Police) immediately!");
  };

  const handleUseMyLocation = () => {
    const locationPermission = localStorage.getItem('locationPermission');
    
    if (locationPermission === 'granted') {
      const savedLat = localStorage.getItem('userLatitude');
      const savedLng = localStorage.getItem('userLongitude');
      
      if (savedLat && savedLng) {
        setFormData(prev => ({
          ...prev,
          latitude: savedLat,
          longitude: savedLng
        }));
        updateMapMarker(parseFloat(savedLat), parseFloat(savedLng));
        toast.success("Using your saved location!");
      } else {
        getUserLocation();
      }
    } else if (locationPermission === 'denied') {
      if (window.confirm("Location permission was previously denied. Would you like to allow location access now?")) {
        localStorage.removeItem('locationPermission');
        getUserLocation();
      } else {
        toast.info("You can click on map to select location manually.");
      }
    } else {
      getUserLocation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <img 
              src="/images/logo.png" 
              alt="SmartReport Logo" 
              className="h-16 w-16 object-contain mb-4"
            />
            <CardTitle className="text-2xl font-bold text-center">
              Create Report
            </CardTitle>
            <CardDescription className="text-center">
              Fill in the details to file a crime report
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="crimeType">Crime Type *</Label>
                <Select
                  value={formData.crimeType}
                  onValueChange={(value) => handleChange("crimeType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the incident..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                  className="min-h-[150px] cursor-text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date *</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => handleChange("incidentDate", e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incidentTime">Time *</Label>
                  <Input
                    id="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => handleChange("incidentTime", e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="locationAddress">Location Address *</Label>
                  <Input
                    id="locationAddress"
                    placeholder="Enter location address"
                    value={formData.locationAddress}
                    onChange={(e) => handleChange("locationAddress", e.target.value)}
                    required
                    className="cursor-text mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Select Crime Location on Map *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseMyLocation}
                      className="cursor-pointer text-xs"
                      disabled={locationLoading}
                    >
                      {locationLoading ? "Detecting..." : "📍 Use My Location"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Click on the map to mark the exact crime location
                  </p>
                  
                  <div id="map" className="h-[400px] border rounded-lg z-10 relative">
                    {locationLoading && (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Latitude *</Label>
                      <Input
                        value={formData.latitude || "Select location..."}
                        readOnly
                        className="cursor-default bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude *</Label>
                      <Input
                        value={formData.longitude || "Select location..."}
                        readOnly
                        className="cursor-default bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-green-600">📌</span>
                    <span className="text-sm text-gray-600">
                      {locationLoading 
                        ? "Detecting your location..." 
                        : formData.latitude 
                          ? `Location set: ${formData.latitude}, ${formData.longitude}`
                          : "Click on map or use 'Use My Location'"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Upload Evidence (Optional - Max 5 files, 10MB each)</Label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="evidenceFiles"
                    onChange={handleFileChange}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    className="hidden"
                    multiple
                  />
                  <label
                    htmlFor="evidenceFiles"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Images, Videos, Audio, Documents (Max 10MB each)
                    </p>
                    <p className="text-sm text-gray-400">
                      {evidenceFiles.length}/5 files selected
                    </p>
                  </label>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Files
                      </span>
                      <span className="text-sm text-gray-500">
                        {evidenceFiles.length} file(s)
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {evidenceFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file)}
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-red-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h4 className="font-bold text-red-800">Emergency?</h4>
                    <p className="text-red-700">
                      For immediate emergency, please call <strong className="font-bold">100</strong> (Police) or use the SOS button.
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleEmergency}
                      className="mt-3 cursor-pointer"
                    >
                      🆘 Emergency SOS
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportCrime;