import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Map from "../Component/NgoMap";
import NGOHeader from "../Component/donorheader";
import DonationRequestList from "../Component/Donationrequestlist";
import {
  getNearbyDonors,
  fetchDonationRequests,
  handleAcceptDonation,
  declineDonation,
  handlePickUpDonation
} from "../services/donationServices";

const NGODashboard = ({ username, onLogout }) => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRequestId, setHoveredRequestId] = useState(null);
  const [addressMap, setAddressMap] = useState({});

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      console.log("Geocoding response:", data);  // Log the full response
  
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0]?.formatted_address || "Address not available";
      } else {
        return "No address found";
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Address lookup failed";
    }
  };
  
  useEffect(() => {
    if (pickupLocation?.lat && pickupLocation?.lng) {
      fetchData(pickupLocation.lat, pickupLocation.lng);
    }
  }, [pickupLocation]);
  

  const fetchData = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const donationRequests = await fetchDonationRequests(lat, lng); // ← pass location
      console.log("API Donation Requests:", donationRequests);
  
      if (donationRequests?.length > 0) {
        const enrichedRequests = await Promise.all(
          donationRequests.map(async (req) => {
            const [latitude, longitude] = req.location.split(',').map(Number);
            const address = await reverseGeocode(latitude, longitude);
  
            return {
              ...req,
              coordinates: {
                lat: latitude,
                lng: longitude,
              },
              address,
              Donor: {
                fullname:req.Donor?.fullname || "Unknown Donor", 
              },
            };
          })
        );
  
        const newAddressMap = enrichedRequests.reduce((acc, req) => {
          acc[req.id] = req.address;
          return acc;
        }, {});
  
        setDonationRequests(enrichedRequests);
        setAddressMap(newAddressMap);
      } else {
        setDonationRequests([]);
      }
    } catch (err) {
      console.error("Error fetching donation data:", err);
      setError(err.message || "Failed to fetch donation requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pickupLocation?.lat && pickupLocation?.lng) {
      fetchData(pickupLocation.lat, pickupLocation.lng);
    }
  }, [pickupLocation, fetchData]);
  
  
  const acceptDonation = async (donationId) => {
    // Optimistic update
    setDonationRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === donationId ? { ...req, status: "accepted" } : req
      )
    );
  
    try {
      // Call API to accept the donation
      const response = await handleAcceptDonation(donationId);
      
      if (response.success) {
        // If successful, do nothing since the optimistic update was already applied
        console.log("Donation accepted successfully");
      } 
    } catch (err) {
      // Revert optimistic update if an error occurs
      setDonationRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === donationId ? { ...req, status: "Pending" } : req
        )
      );
      alert("An error occurred while accepting the donation.");
      console.error("Error accepting donation:", err);
    }
  };
  
  
  const handleDecline = async (donationId) => {
    // Optimistic update
    setDonationRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== donationId)
    );
  
    try {
      const response = await declineDonation(donationId);
      if (!response.success) {
        // Restore donation request if decline fails
        setDonationRequests((prevRequests) => [
          ...prevRequests,
          { id: donationId, status: "Pending" }, // Add back the declined request
        ]);
        alert("An error occurred while declining the donation.");
      }
    } catch (error) {
      // Revert optimistic update if error occurs
      setDonationRequests((prevRequests) => [
        ...prevRequests,
        { id: donationId, status: "pending" }, // Add back the declined request
      ]);
      alert("An error occurred while declining the donation.");
    }
  };
  
  const markAsPickedUp = async (donationId) => {
    try {
      await handlePickUpDonation(donationId);
      // Update the donation request in state to reflect the new status
      setDonationRequests((prevRequests) =>
        prevRequests.map((donation) =>
          donation.id === donationId ? { ...donation, ngo_status: "picked up" } : donation
        )
      );
    } catch (err) {
      console.error("Error marking as picked up:", err);
    }
  };

  

  return (
    <Box>
      <NGOHeader username={username} onLogout={onLogout} />
      <Box p={2}>
        <Map
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          hoveredRequestId={hoveredRequestId}
          donationRequests={donationRequests}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <DonationRequestList
  requests={donationRequests}
  onAccept={acceptDonation}
  onDecline={handleDecline}
  markAsPickedUp={markAsPickedUp} // Pass the function here
  hoveredRequestId={hoveredRequestId}
  setHoveredRequestId={setHoveredRequestId}
  addressMap={addressMap}
/>

        )}
      </Box>
    </Box>
  );
};

export default NGODashboard;