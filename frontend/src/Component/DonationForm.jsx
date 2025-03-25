import React, { useState } from "react";
import { createDonation } from "../services/donationServices";
import { handleError } from "../utils/errorHandler";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const DonationForm = ({ location }) => {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !location.lat || !location.lng) {
      setError("Location data is missing. Please enable location services.");
      return;
    }

    try {
      await createDonation(foodType, quantity, expiryDate, `${location.lat}, ${location.lng}`);
      setSuccess(true);
      setError(null);
      setFoodType("");
      setQuantity("");
      setExpiryDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create donation. Please try again.");
      handleError(err, "DonationForm");
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Create Donation
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Donation created successfully!</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Food Type"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Expiry Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Donate Food
        </Button>
      </Box>
    </Container>
  );
};

export default DonationForm;

