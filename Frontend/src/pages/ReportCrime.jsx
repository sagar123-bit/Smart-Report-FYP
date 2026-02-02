import { CREATE_CRIME_REPORT, UPDATE_CRIME_REPORT } from "@/routes/serverEndpoint";
import { fetchAllCrimeReports } from "@/store/slices/getAllReports";
import axiosService from "@/utils/axiosService";
import { ArrowLeft, File, FileText, Image, Trash2, Upload, Video, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from 'react-toastify';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

const ReportCrime = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const editReportId = searchParams.get('edit');
  
  const userData = useSelector(state => state?.user?.user);
  const crimeReportsState = useSelector(state => state?.allReports);
  const { reports: allReports = [] } = crimeReportsState || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const provinces = [
    "Koshi",
    "Madesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim"
  ];

  const [formData, setFormData] = useState({
    crimeType: "",
    description: "",
    incidentDate: "",
    incidentTime: "",
    locationAddress: "",
    province: "",
    latitude: "",
    longitude: ""
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [existingEvidencePaths, setExistingEvidencePaths] = useState([]);
  const [removedEvidencePaths, setRemovedEvidencePaths] = useState([]);

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

  const getFullEvidenceUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_SERVER_URL}/${path}`;
  };

  const initializeEditMode = useCallback(() => {
    if (editReportId && allReports.length > 0) {
      const reportToEdit = allReports.find(report => report._id === editReportId);
      
      if (reportToEdit) {
        setIsEditMode(true);
        
        setFormData({
          crimeType: reportToEdit.crimeType || "",
          description: reportToEdit.description || "",
          incidentDate: reportToEdit.incidentDate ? 
            new Date(reportToEdit.incidentDate).toISOString().split('T')[0] : "",
          incidentTime: reportToEdit.incidentTime || "",
          locationAddress: reportToEdit.locationAddress || "",
          province: reportToEdit.province || "",
          latitude: reportToEdit.coordinates?.latitude?.toString() || reportToEdit.latitude?.toString() || "",
          longitude: reportToEdit.coordinates?.longitude?.toString() || reportToEdit.longitude?.toString() || ""
        });

        if (reportToEdit.evidences && reportToEdit.evidences.length > 0) {
          setExistingEvidencePaths(reportToEdit.evidences);
        } else if (reportToEdit.evidenceUrls && reportToEdit.evidenceUrls.length > 0) {
          setExistingEvidencePaths(reportToEdit.evidenceUrls);
        }
      } else {
        toast.error("Report not found. Creating new report instead.");
      }
      setIsInitialized(true);
    }
  }, [editReportId, allReports]);

  useEffect(() => {
    if (!isInitialized) {
      initializeEditMode();
    }
  }, [initializeEditMode, isInitialized]);

  const initializeNewReport = useCallback(() => {
    if (!editReportId && !isEditMode) {
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
        toast.info("Using default Ithari location.");
        setDefaultIthariLocation();
        setLocationLoading(false);
      } else {
        const askForLocation = () => {
          if (window.confirm("Allow SmartReport to access your location?")) {
            getUserLocation();
          } else {
            localStorage.setItem('locationPermission', 'denied');
            toast.info("Using default Ithari location.");
            setDefaultIthariLocation();
            setLocationLoading(false);
          }
        };

        setTimeout(() => {
          askForLocation();
        }, 500);
      }
    }
  }, [editReportId, isEditMode]);

  useEffect(() => {
    initializeNewReport();
  }, [initializeNewReport]);

  useEffect(() => {
    if (formData.latitude && formData.longitude && !mapRef.current && !mapInitialized) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      initializeMap(lat, lng);
      setMapInitialized(true);
    }
  }, [formData.latitude, formData.longitude, mapInitialized]);

  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.warn("Geolocation is not supported");
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
        
        toast.success("Location detected!");
        updateMapMarker(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        localStorage.setItem('locationPermission', 'denied');
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
    try {
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
      setLocationLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const keptExistingFiles = existingEvidencePaths.length - removedEvidencePaths.length;
    const totalCurrentFiles = keptExistingFiles + evidenceFiles.length;
    
    if (totalCurrentFiles + files.length > 5) {
      toast.error(`Maximum 5 files allowed.`);
      return;
    }

    if (isEditMode) {
      const availableSlotsForEdit = removedEvidencePaths.length;
      if (evidenceFiles.length + files.length > availableSlotsForEdit) {
        toast.error(`You can only add ${availableSlotsForEdit - evidenceFiles.length} more file(s) as replacement.`);
        return;
      }
    } else {
      if (evidenceFiles.length + files.length > 5) {
        toast.error(`You can only add ${5 - evidenceFiles.length} more file(s).`);
        return;
      }
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
      toast.error(`${invalidFiles.length} file(s) exceed 10MB limit.`);
    }

    if (validFiles.length > 0) {
      setEvidenceFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingEvidence = (index) => {
    const pathToRemove = existingEvidencePaths[index];
    setRemovedEvidencePaths(prev => [...prev, pathToRemove]);
    setExistingEvidencePaths(prev => prev.filter((_, i) => i !== index));
  };

  const restoreExistingEvidence = (index) => {
    const pathToRestore = removedEvidencePaths[index];
    setRemovedEvidencePaths(prev => prev.filter((_, i) => i !== index));
    setExistingEvidencePaths(prev => [...prev, pathToRestore]);
  };

  const getFileIcon = (file) => {
    if (typeof file === 'string') {
      const ext = file.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className="h-4 w-4" />;
      if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return <Video className="h-4 w-4" />;
      if (ext === 'pdf') return <FileText className="h-4 w-4" />;
      if (['mp3', 'wav', 'ogg'].includes(ext)) return <File className="h-4 w-4" />;
      return <File className="h-4 w-4" />;
    }
    
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
      toast.error("You must be logged in.");
      setIsLoading(false);
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location.");
      setIsLoading(false);
      return;
    }

    if (!formData.crimeType) {
      toast.error("Please select a crime type.");
      setIsLoading(false);
      return;
    }

    if (!formData.description) {
      toast.error("Please provide a description.");
      setIsLoading(false);
      return;
    }

    if (!formData.incidentDate || !formData.incidentTime) {
      toast.error("Please provide date and time.");
      setIsLoading(false);
      return;
    }

    if (!formData.locationAddress) {
      toast.error("Please provide location address.");
      setIsLoading(false);
      return;
    }

    if (!formData.province) {
      toast.error("Please select province.");
      setIsLoading(false);
      return;
    }

    const keptExistingFiles = existingEvidencePaths.length - removedEvidencePaths.length;
    const totalFiles = keptExistingFiles + evidenceFiles.length;
    
    if (totalFiles > 5) {
      toast.error("Maximum 5 files allowed.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append('crimeType', formData.crimeType);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('incidentDate', formData.incidentDate);
    formDataToSend.append('incidentTime', formData.incidentTime);
    formDataToSend.append('locationAddress', formData.locationAddress);
    formDataToSend.append('province', formData.province);
    formDataToSend.append('latitude', formData.latitude);
    formDataToSend.append('longitude', formData.longitude);
    
    evidenceFiles.forEach((file) => {
      formDataToSend.append('evidences', file);
    });

    try {
      let response;
      
      if (isEditMode && editReportId) {
        removedEvidencePaths.forEach(path => {
          formDataToSend.append('removedEvidences', path);
        });
        
        existingEvidencePaths.forEach(path => {
          if (!removedEvidencePaths.includes(path)) {
            formDataToSend.append('existingEvidences', path);
          }
        });
        
        response = await axiosService.patch(
          `${UPDATE_CRIME_REPORT}/${editReportId}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        );
        
        if(response?.status===200){
          await dispatch(fetchAllCrimeReports());
          toast.success("Report updated!");
        }
        
      } else {
        response = await axiosService.post(CREATE_CRIME_REPORT, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        
        if(response?.status===201){
          await dispatch(fetchAllCrimeReports());
          toast.success("Report submitted!");
        }
      }
      
      setEvidenceFiles([]);
      setExistingEvidencePaths([]);
      setRemovedEvidencePaths([]);
      
      if (!isEditMode) {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
        
        setFormData({
          crimeType: "",
          description: "",
          incidentDate: today,
          incidentTime: now,
          locationAddress: "",
          province: "",
          latitude: "",
          longitude: ""
        });
      }
      
      navigate("/myreport");
    } catch (error) {
      console.log("Report submission error:", error);
      toast.error(
        error?.response?.data?.message || 
        "Failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergency = () => {
    toast.info("For Emergency, please call 100!");
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
      if (window.confirm("Allow location access?")) {
        localStorage.removeItem('locationPermission');
        getUserLocation();
      } else {
        toast.info("Click on map to select location.");
      }
    } else {
      getUserLocation();
    }
  };

  const handleCancelEdit = () => {
    navigate("/myreport");
  };

  const keptExistingFiles = existingEvidencePaths.length - removedEvidencePaths.length;
  const totalCurrentFiles = keptExistingFiles + evidenceFiles.length;
  const canAddMoreFiles = isEditMode ? evidenceFiles.length < removedEvidencePaths.length : totalCurrentFiles < 5;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-4 mb-4">
              {isEditMode && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Reports
                </Button>
              )}
              <img 
                src="/images/logo.png" 
                alt="SmartReport Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isEditMode ? "Update Report" : "Create Report"}
            </CardTitle>
            <CardDescription>
              {isEditMode 
                ? "Update the details of your crime report" 
                : "Fill in the details to file a crime report"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="crimeType">Crime Type *</Label>
                <Select
                  value={formData.crimeType}
                  onValueChange={(value) => handleChange("crimeType", value)}
                  key={formData.crimeType || "default"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type">
                      {formData.crimeType ? 
                        crimeTypes.find(type => type.value === formData.crimeType)?.label : 
                        "Select crime type"
                      }
                    </SelectValue>
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
                  placeholder="Provide detailed description..."
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

              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => handleChange("province", value)}
                  key={formData.province || "default"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province">
                      {formData.province || "Select province"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <div className="flex justify-between items-center">
                  <Label>Upload Evidence (Optional - Max 5 files, 10MB each)</Label>
                  <span className="text-sm text-gray-500">
                    {totalCurrentFiles}/5 files
                  </span>
                </div>
                
                {isEditMode && existingEvidencePaths.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Existing Evidence:
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {existingEvidencePaths.map((path, index) => {
                        const isRemoved = removedEvidencePaths.includes(path);
                        const fileName = path.split('/').pop();
                        const isImage = fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                        const fullUrl = getFullEvidenceUrl(path);
                        
                        return (
                          <div
                            key={index}
                            className={`relative border rounded-lg overflow-hidden ${
                              isRemoved ? 'border-red-300 opacity-60' : 'border-gray-200'
                            }`}
                          >
                            <div className="relative h-40 bg-gray-100">
                              {isImage ? (
                                <img
                                  src={fullUrl}
                                  alt={`Evidence ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '';
                                    e.target.parentElement.innerHTML = `
                                      <div class="w-full h-full flex flex-col items-center justify-center">
                                        <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span class="mt-2 text-sm text-gray-500">${fileName}</span>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                  {getFileIcon(fileName)}
                                  <span className="mt-2 text-sm text-gray-500 truncate px-2">
                                    {fileName}
                                  </span>
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <Button
                                  type="button"
                                  variant={isRemoved ? "outline" : "destructive"}
                                  size="sm"
                                  onClick={() => isRemoved ? restoreExistingEvidence(index) : removeExistingEvidence(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  {isRemoved ? (
                                    <span className="text-xs">↺</span>
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium truncate">
                                {fileName}
                              </p>
                              {!isRemoved && (
                                <a 
                                  href={fullUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  View Full
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {removedEvidencePaths.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        {removedEvidencePaths.length} file(s) marked for removal. You can upload {removedEvidencePaths.length} new file(s) as replacement.
                      </p>
                    )}
                  </div>
                )}
                
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  canAddMoreFiles ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="evidenceFiles"
                    onChange={handleFileChange}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    className="hidden"
                    multiple
                    disabled={!canAddMoreFiles}
                  />
                  <label
                    htmlFor="evidenceFiles"
                    className={`cursor-pointer flex flex-col items-center ${!canAddMoreFiles && 'cursor-not-allowed'}`}
                  >
                    <Upload className={`h-12 w-12 mb-4 ${canAddMoreFiles ? 'text-gray-400' : 'text-gray-300'}`} />
                    <p className="text-lg font-medium mb-2">
                      {canAddMoreFiles ? "Click to upload or drag and drop" : "Maximum files reached"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Images (Max 10MB each)
                    </p>
                    <p className="text-sm text-gray-400">
                      {evidenceFiles.length} new file(s) uploaded
                      {isEditMode && existingEvidencePaths.length > 0 && 
                        `, ${keptExistingFiles} existing file(s) kept`
                      }
                    </p>
                    {isEditMode && removedEvidencePaths.length > 0 && evidenceFiles.length < removedEvidencePaths.length && (
                      <p className="text-sm text-green-600 mt-2">
                        You can upload {removedEvidencePaths.length - evidenceFiles.length} more file(s)
                      </p>
                    )}
                    {!isEditMode && evidenceFiles.length < 5 && (
                      <p className="text-sm text-green-600 mt-2">
                        You can upload {5 - evidenceFiles.length} more file(s)
                      </p>
                    )}
                    {totalCurrentFiles >= 5 && (
                      <p className="text-sm text-red-500 mt-2">
                        Maximum 5 files reached.
                      </p>
                    )}
                  </label>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        New Files to Upload
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
                      For immediate emergency, please call <strong className="font-bold">100</strong>.
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
                  onClick={isEditMode ? handleCancelEdit : () => navigate(-1)}
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
                  {isLoading 
                    ? (isEditMode ? "Updating..." : "Submitting...") 
                    : (isEditMode ? "Update Report" : "Submit Report")
                  }
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
