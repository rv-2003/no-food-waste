import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Typography, Paper } from "@mui/material";

const libraries = ["places", "geometry", "marker"]; //Ensure "marker" library is included

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const Map = ({ pickupLocation, setPickupLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, //Ensure correct libraries are loaded
    mapIds: ["7b14a3815605d75"], // Ensure valid Map ID
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User Location:", userLocation); // Debugging log
          setPickupLocation(userLocation);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // <-- Added settings
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
   

  useEffect(() => {
    if (!isLoaded || !window.google || !window.google.maps || !pickupLocation) {
      return;
    }

    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current, {
      center: pickupLocation,
      zoom: 15,
      mapId: "7b14a3815605d75",
    });

    
    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
      if (markerRef.current) {
        markerRef.current.setMap(null);//Remove previous marker
      }

      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: pickupLocation,
      });

      console.log("Marker placed at:", pickupLocation);
    } else {
      console.error("AdvancedMarkerElement is not available. Make sure 'marker' library is loaded.");
    }
  }, [isLoaded, pickupLocation]);

  if (loadError) return <Typography>Error loading maps</Typography>;
  if (!isLoaded) return <Typography>Loading Maps...</Typography>;
  if (!pickupLocation) return <Typography>Fetching your location...</Typography>;

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Donation Location
      </Typography>
      <div ref={mapRef} style={mapContainerStyle} />
    </Paper>
  );
};

export default Map;













