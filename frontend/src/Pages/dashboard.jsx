import React, { useState, useEffect } from "react";
import DonorDashboardHeader from "../Component/donorheader";
import DonationForm from "../Component/DonationForm";
import DonationHistory from "../Component/DonationHistory";
import Map from "../Component/MapComponent";
import { Container, Typography, Alert } from "@mui/material";

const Dashboard = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const username = "JohnDoe"; // Replace this with actual username from state/context

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Prevent unnecessary updates
          setPickupLocation((prevLocation) =>
            prevLocation?.lat !== newLocation.lat || prevLocation?.lng !== newLocation.lng
              ? newLocation
              : prevLocation
          );

          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to get location. Please enable GPS.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      {/* Donor Dashboard Header */}
      <DonorDashboardHeader username={username} />

      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Donor Dashboard
        </Typography>

        {/* Show Error Message if Location Fails */}
        {locationError && <Alert severity="error">{locationError}</Alert>}

        {/* Pass location to Map */}
        <Map pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} />

        {/* Show Donation Form only if location is available */}
        {pickupLocation && <DonationForm location={pickupLocation} />}

        <DonationHistory />
      </Container>
    </>
  );
};

export default Dashboard;

