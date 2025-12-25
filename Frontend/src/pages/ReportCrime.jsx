import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';

const ReportCrime = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    crimeType: "",
    description: "",
    date: "",
    time: "",
    location: "",
    latitude: "",
    longitude: "",
    evidence: null
  });

  const crimeTypes = [
    "Theft/Burglary",
    "Assault",
    "Fraud/Scam",
    "Harassment",
    "Cyber Crime",
    "Drug Related",
    "Domestic Violence",
    "Public Disorder",
    "Traffic Violation",
    "Property Damage",
    "Other"
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
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }));
        
        toast.success("Your location detected successfully!");
        updateMapMarker(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        console.log("Location error:", error);
        
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
        latitude: clickedLat.toFixed(6),
        longitude: clickedLng.toFixed(6)
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
      date: today,
      time: now
    }));

    const askForLocation = () => {
      if (window.confirm("Allow SmartReport to access your location for accurate crime reporting?")) {
        getUserLocation();
      } else {
        toast.info("Using default Ithari location. You can click on map to select location.");
        setDefaultIthariLocation();
        setLocationLoading(false);
      }
    };

    setTimeout(() => {
      askForLocation();
    }, 500);

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
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({ ...prev, evidence: file }));
    } else {
      toast.error("File size must be less than 10MB");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map");
      setIsLoading(false);
      return;
    }
    
    console.log("Submitting report:", formData);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    navigate("/dashboard");
    setIsLoading(false);
  };

  const handleEmergency = () => {
    toast.info("For Emergency, please call 100 (Police) immediately!");
  };

  const handleUseMyLocation = () => {
    getUserLocation();
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
                <Label htmlFor="crimeType">Crime Type</Label>
                <Select
                  value={formData.crimeType}
                  onValueChange={(value) => handleChange("crimeType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Location Address</Label>
                  <Input
                    id="location"
                    placeholder="Enter location address"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                    className="cursor-text mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Select Crime Location on Map</Label>
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
                  
                  <div id="map" className="h-[400px] border rounded-lg">
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
                      <Label>Latitude</Label>
                      <Input
                        value={formData.latitude || "Select location..."}
                        readOnly
                        className="cursor-default bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
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

              <div className="space-y-2">
                <Label>Upload Evidence</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="evidence"
                    onChange={handleFileChange}
                    accept="image/*,video/*,audio/*,.pdf"
                    className="hidden"
                  />
                  <label
                    htmlFor="evidence"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="text-4xl mb-4">📎</div>
                    <p className="text-lg font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Images, Videos, Audio, PDF (Max 10MB each)
                    </p>
                    {formData.evidence && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.evidence.name}
                      </p>
                    )}
                  </label>
                </div>
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