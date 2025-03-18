import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import { RestaurantMenu, LocationOn, AccessTime, Store } from "@mui/icons-material";
import axios from "axios";

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newDonation, setNewDonation] = useState({
    foodType: "",
    quantity: "",
    expiryTime: "",
    pickupLocation: "",
    description: ""
  });

  useEffect(() => {
    // Get user info and available donations
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Get user profile to determine role
        const userResponse = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserRole(userResponse.data.role);

        // Get all donations
        const donationsResponse = await axios.get("http://localhost:5000/api/donations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDonations(donationsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateDonation = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/donations",
        newDonation,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh donations list
      const donationsResponse = await axios.get("http://localhost:5000/api/donations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDonations(donationsResponse.data);
      setOpenDialog(false);
      setNewDonation({
        foodType: "",
        quantity: "",
        expiryTime: "",
        pickupLocation: "",
        description: ""
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      alert("Failed to create donation");
    }
  };

  const handleClaimDonation = async (donationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/donations/${donationId}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh donations list
      const donationsResponse = await axios.get("http://localhost:5000/api/donations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDonations(donationsResponse.data);
      alert("Donation claimed successfully!");
    } catch (error) {
      console.error("Error claiming donation:", error);
      alert("Failed to claim donation");
    }
  };

  const handleInputChange = (e) => {
    setNewDonation({
      ...newDonation,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "success";
      case "claimed": return "primary";
      case "completed": return "secondary";
      case "expired": return "error";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Food Donation Dashboard</Typography>
        {(userRole === "restaurant" || userRole === "caterer" || userRole === "event") && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setOpenDialog(true)}
          >
            Add New Donation
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {donations.map((donation) => (
          <Grid item xs={12} md={6} lg={4} key={donation._id}>
            <Card 
              sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)"
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {donation.foodType}
                  </Typography>
                  <Chip 
                    label={donation.status} 
                    color={getStatusColor(donation.status)} 
                    size="small" 
                  />
                </Box>

                <Typography color="text.secondary" gutterBottom>
                  <Store sx={{ fontSize: 16, mr: 1, verticalAlign: "text-bottom" }} />
                  {donation.donorName}
                </Typography>
                
                <Typography sx={{ mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: "text-bottom" }} />
                  {donation.pickupLocation}
                </Typography>
                
                <Typography sx={{ mb: 1 }}>
                  <RestaurantMenu sx={{ fontSize: 16, mr: 1, verticalAlign: "text-bottom" }} />
                  Quantity: {donation.quantity}
                </Typography>
                
                <Typography sx={{ mb: 2 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: "text-bottom" }} />
                  Pick up before: {new Date(donation.expiryTime).toLocaleString()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {donation.description}
                </Typography>
              </CardContent>

              {userRole === "ngo" && donation.status === "available" && (
                <Box sx={{ p: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleClaimDonation(donation._id)}
                  >
                    Claim This Donation
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}

        {donations.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No donations available at the moment
              </Typography>
              {(userRole === "restaurant" || userRole === "caterer" || userRole === "event") && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => setOpenDialog(true)}
                >
                  Create Your First Donation
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Dialog for creating new donations */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Food Donation</DialogTitle>
        <DialogContent>
          <TextField
            name="foodType"
            label="Food Type"
            fullWidth
            margin="normal"
            value={newDonation.foodType}
            onChange={handleInputChange}
            placeholder="e.g., Cooked meals, Sandwiches, Desserts"
          />
          <TextField
            name="quantity"
            label="Quantity"
            fullWidth
            margin="normal"
            value={newDonation.quantity}
            onChange={handleInputChange}
            placeholder="e.g., 20 meals, 5kg of rice, 10 boxes"
          />
          <TextField
            name="expiryTime"
            label="Available Until"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newDonation.expiryTime}
            onChange={handleInputChange}
          />
          <TextField
            name="pickupLocation"
            label="Pickup Location"
            fullWidth
            margin="normal"
            value={newDonation.pickupLocation}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newDonation.description}
            onChange={handleInputChange}
            placeholder="Any specific details about the food, packaging, dietary information, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateDonation} variant="contained" color="primary">
            Create Donation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;