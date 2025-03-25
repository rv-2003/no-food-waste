import React, { useEffect, useState } from "react";
import { fetchDonations } from "../services/donationServices";
import { handleError } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from "@mui/material";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const data = await fetchDonations();
        setDonations(data);
      } catch (err) {
        setError("Error fetching donations. Please try again.");
        handleError(err, "DonationHistory");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (donations.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No donations found.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* 🚀 Improved Header Design */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Donation History
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Track your past donations
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} /> {/* Adds a subtle line below the header */}
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Food Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expiry Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{donation.foodType}</TableCell>
                <TableCell>{donation.quantity}</TableCell>
                <TableCell>
                  {new Date(donation.expiryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{donation.location}</TableCell>
                <TableCell>{donation.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DonationHistory;


