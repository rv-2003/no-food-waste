import React, { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Typography, Paper, Button, Alert } from "@mui/material";

const libraries = ["places", "geometry", "marker"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const DEFAULT_CENTER = { lat: 19.0760, lng: 72.8777 };

const RequestMap = ({ 
  donationRequests, 
  hoveredRequestId, 
  setPickupLocation,
  onError 
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    mapIds: ["7b14a3815605d75"],
    version: "beta",
  });

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [ngoLocation, setNgoLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [ngoMarker, setNgoMarker] = useState(null); // To store NGO marker reference

  const parseLocation = (location) => {
    if (!location) return null;

    try {
      if (typeof location === 'string') {
        const cleaned = location.replace(/\s/g, '');
        const [latStr, lngStr] = cleaned.split(',');
        
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      
      if (typeof location === 'object') {
        if (location.lat && location.lng) {
          return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng)
          };
        }
        if (location.latitude && location.longitude) {
          return {
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude)
          };
        }
      }
    } catch (e) {
      console.error("Error parsing location:", e);
    }
    
    return null;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setNgoLocation(location);
          setPickupLocation(location);
          setLocationPermission(true);
          
          // Update NGO marker if map is already initialized
          if (mapInitialized && ngoMarker) {
            ngoMarker.position = location;
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setNgoLocation(DEFAULT_CENTER);
          setPickupLocation(DEFAULT_CENTER);
          setLocationPermission(false);
        }
      );
    } else {
      setNgoLocation(DEFAULT_CENTER);
      setPickupLocation(DEFAULT_CENTER);
      setLocationPermission(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const initMap = async () => {
      try {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        const { InfoWindow } = await google.maps.importLibrary("maps");

        const map = new Map(mapRef.current, {
          center: ngoLocation || DEFAULT_CENTER,
          zoom: 13,
          mapId: "7b14a3815605d75",
        });

        // Clear existing markers
        markersRef.current.forEach(marker => {
          if (marker?.marker?.map) {
            marker.marker.map = null;
          }
        });
        markersRef.current = [];

        // InfoWindow (single instance reused)
        infoWindowRef.current = new InfoWindow();

        // Create blue NGO marker
        const ngoPin = new PinElement({
          background: "#4285F4",  // Blue color
          borderColor: "#4285F4",
          glyphColor: "white",
        });
        
        const marker = new AdvancedMarkerElement({
          position: ngoLocation || DEFAULT_CENTER,
          map,
          title: "Your NGO Location",
          content: ngoPin.element,
        });

        // Store NGO marker reference
        setNgoMarker(marker);

        // Add click listener for NGO marker
        marker.addListener("click", () => {
          infoWindowRef.current.setContent(`
            <div>
              <strong>Your NGO Location</strong><br/>
              <em>Lat:</em> ${marker.position.lat.toFixed(6)}<br/>
              <em>Lng:</em> ${marker.position.lng.toFixed(6)}
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        });

        // Process donation requests (red markers)
        let validCount = 0;
        donationRequests.forEach(req => {
          if (req.coordinates) {
            const position = req.coordinates;
            validCount++;
            
            const pin = new PinElement({
              background: "#DB4437",  // Red color
              borderColor: "#DB4437",
              glyphColor: "white",
            });

            const donorMarker = new AdvancedMarkerElement({
              position,
              map,
              title: req.Donor?.fullname || "Unknown Donor",
              content: pin.element,
            });

            donorMarker.addListener("click", () => {
              infoWindowRef.current.setContent(`
                <div>
                  <strong>Food:</strong> ${req.foodType}<br/>
                  <strong>Donor:</strong> ${req.Donor?.fullname || "Unknown"}<br/>
                  <strong>Qty:</strong> ${req.quantity}
                </div>
              `);
              infoWindowRef.current.open(map, donorMarker);
            });

            markersRef.current.push({ 
              requestId: req.id, 
              marker: donorMarker,
              position 
            });
          }
        });

        if (validCount < donationRequests.length) {
          setLocationError(`${donationRequests.length - validCount} requests skipped - invalid locations`);
        } else {
          setLocationError(null);
        }

        setMapInitialized(true);

      } catch (error) {
        console.error("Error initializing map:", error);
        if (onError) onError(error.message);
        setMapInitialized(false);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        if (marker?.marker?.map) {
          marker.marker.map = null;
        }
      });
      markersRef.current = [];
      
      // Cleanup NGO marker
      if (ngoMarker?.map) {
        ngoMarker.map = null;
      }
    };
  }, [isLoaded, donationRequests, ngoLocation, onError]);

  // Handle hover effect on donor markers
  useEffect(() => {
    if (!mapInitialized || !hoveredRequestId || !markersRef.current) return;

    const hoveredMarker = markersRef.current.find(m => m.requestId === hoveredRequestId);
    if (hoveredMarker) {
      if (hoveredMarker.marker.map) {
        hoveredMarker.marker.map.setZoom(15);
        hoveredMarker.marker.map.setCenter(hoveredMarker.position);
      }
      
      if (hoveredMarker.marker.content) {
        hoveredMarker.marker.content.style.transform = "scale(1.5)";
        hoveredMarker.marker.content.style.transition = "transform 0.3s ease";
      }
    }

    return () => {
      if (hoveredMarker?.marker?.content) {
        hoveredMarker.marker.content.style.transform = "scale(1)";
      }
    };
  }, [hoveredRequestId, mapInitialized]);

  if (loadError) {
    return (
      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
        <Alert severity="error">
          Failed to load Google Maps. Please check:
          <ul>
            <li>Your API key is valid</li>
            <li>Billing is enabled for Google Maps</li>
            <li>Maps JavaScript API is enabled</li>
          </ul>
        </Alert>
      </Paper>
    );
  }

  if (!isLoaded) {
    return (
      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
        <Typography>Loading map...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Donation Request Locations
      </Typography>
      {!locationPermission && (
        <Button 
          variant="contained" 
          onClick={handleGetLocation}
          sx={{ mb: 2 }}
        >
          Use My Current Location
        </Button>
      )}
      {locationError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {locationError}
        </Alert>
      )}
      <div ref={mapRef} style={mapContainerStyle} />
    </Paper>
  );
};

export default RequestMap;

