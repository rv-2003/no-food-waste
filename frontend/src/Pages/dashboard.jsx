import React, { useState, useEffect } from "react";
import DonorDashboardHeader from "../Component/donorheader";
import DonationForm from "../Component/DonationForm";
import Map from "../Component/MapComponent";
import {
  Container,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  Button,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  fetchDonations,
  handleCancelDonation,
  handleAcceptDonation,
} from "../services/donationServices";
import api from "../utils/api";


const Dashboard = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const username = "JohnDoe";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickupLocation((prev) =>
            prev?.lat !== newLocation.lat || prev?.lng !== newLocation.lng
              ? newLocation
              : prev
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

  const loadDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDonations();
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
      setError("Failed to load donations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const markAsDelivered = async (donationId) => {
    try {
      await api.patch(`/donations/${donationId}/donor-status`, {
        status: "delivered",
      });
      setDonations((prev) =>
        prev.map((don) =>
          don.id === donationId ? { ...don, donor_status: "delivered" } : don
        )
      );
    } catch (err) {
      console.error("Error marking as delivered:", err);
    }
  };

  const cancelDonation = async (donationId) => {
    try {
      await handleCancelDonation(donationId, setDonations);
    } catch (err) {
      console.error("Error cancelling donation:", err);
    }
  };

  return (
    <>
      <DonorDashboardHeader username={username} />
      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Donor Dashboard
        </Typography>

        {locationError && <Alert severity="error">{locationError}</Alert>}

        <Map pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} />

        {pickupLocation && <DonationForm location={pickupLocation} />}

        {loading && <CircularProgress sx={{ mt: 4 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Pending Donations
          </Typography>

          {donations.length === 0 ? (
            <Typography>No pending donations found.</Typography>
          ) : (
            <List>
              {donations.map((donation) => (
                <ListItem
                  key={donation.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <ListItemText
                    primary={`🍽 Food: ${donation.foodType}`}
                    secondary={`Quantity: ${donation.quantity} | Status: ${donation.status}`}
                  />

                  <div style={{ marginTop: 8 }}>
                    {donation.status === "Pending" && (
                      <Button color="error" onClick={() => cancelDonation(donation.id)}>
                        Cancel
                      </Button>
                    )}
                    {donation.status === "accepted" && donation.donor_status !== "delivered" && (
                      <Button color="primary" onClick={() => markAsDelivered(donation.id)}>
                        Mark as Delivered
                      </Button>
                    )}
                    {(donation.donor_status === "cancelled" || donation.donor_status === "delivered") && (
                      <Typography variant="body2" color="text.secondary">
                        Done
                      </Typography>
                    )}
                  </div>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;
