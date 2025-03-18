import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 28.6139, lng: 77.2090 }; // Default location (New Delhi)

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const restaurantName = user?.name || "Restaurant";

  const [open, setOpen] = useState(false);
  const [foodDetails, setFoodDetails] = useState({ name: "", quantity: "", expiry: "" });
  const [foodList, setFoodList] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFoodDetails({ ...foodDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!foodDetails.name || !foodDetails.quantity || !foodDetails.expiry) {
      alert("Please fill all fields!");
      return;
    }
    setFoodList([...foodList, foodDetails]);
    setFoodDetails({ name: "", quantity: "", expiry: "" });
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {restaurantName}
          </Typography>
          <IconButton color="inherit" onClick={() => window.location.href = "/profile"}>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Google Map */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
          <Marker position={center} label="Restaurant" />
        </GoogleMap>
      </LoadScript>

      {/* Add Food Button */}
      <Button variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }} onClick={handleOpen}>
        Add Food
      </Button>

      {/* Add Food Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Food Details</DialogTitle>
        <DialogContent>
          <TextField label="Food Name" name="name" fullWidth margin="normal" value={foodDetails.name} onChange={handleChange} />
          <TextField label="Quantity" name="quantity" fullWidth margin="normal" value={foodDetails.quantity} onChange={handleChange} />
          <TextField label="Expiry Date" name="expiry" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} value={foodDetails.expiry} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Food List Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Food Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Expiry Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodList.map((food, index) => (
              <TableRow key={index}>
                <TableCell>{food.name}</TableCell>
                <TableCell>{food.quantity}</TableCell>
                <TableCell>{food.expiry}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

