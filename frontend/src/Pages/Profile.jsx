import React, { useEffect, useState } from "react";
import { fetchDonations } from "../services/donationServices";
import { Alert, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import {
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const UserProfile = () => {
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [donationError, setDonationError] = useState(null);

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(""); // Format: 'YYYY-MM'

  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    phone: "",
    address: "",
    nameByRole: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDonationData = async () => {
    try {
      const data = await fetchDonations();
  
      if (!user || !user._id) return;
  
      let relevantDonations = [];
  
      if (user.role === "ngo") {
        relevantDonations = data.filter(
          (donation) =>
            donation.donor_status === "delivered" &&
            donation.ngo_status === "picked up" &&
            donation.acceptedBy === user._id
        );
      } else {
        // Donor (restaurant, caterer, event planner)
        relevantDonations = data.filter(
          (donation) =>
            donation.donor_status === "delivered" &&
            donation.ngo_status === "picked up" &&
            donation.userId === user._id
        );
      }
  
      setDonations(relevantDonations);
    } catch (err) {
      setDonationError("Error fetching donations. Please try again.");
      handleError(err, "UserProfile - Donation History");
    } finally {
      setLoadingDonations(false);
    }
  };
  

  

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      setUser(userData);

      const nameByRole = userData.roleName || "";
      setEditData({
        phone: userData.phone || "",
        address: userData.address || "",
        nameByRole,
      });

      if (userData.profilePic) {
        const fullImageUrl = userData.profilePic.startsWith("http")
          ? userData.profilePic
          : `http://localhost:5000${userData.profilePic}`;
        setProfileImage(fullImageUrl);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchUserProfile(); // gets user and sets user state
  }, []);
  
  useEffect(() => {
    if (user && user._id) {
      fetchDonationData(); // only when user info is available
    }
  }, [user]);

  const handleEdit = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      phone: editData.phone,
      address: editData.address,
      roleName: editData.nameByRole,
    };

    try {
      const response = await axios.put("http://localhost:5000/api/users/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setEditData((prev) => ({
        ...prev,
        nameByRole: response.data.roleName || "",
      }));
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/users/upload-profile-pic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUserProfile();
    } catch (error) {
      console.error("Image upload failed:", error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFilterOpen = () => setFilterDialogOpen(true);
  const handleFilterClose = () => setFilterDialogOpen(false);
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value); // Format: 'YYYY-MM'
    handleFilterClose();
  };

  const filteredDonations = selectedMonth
    ? donations.filter((donation) => {
        const donationMonth = new Date(donation.expiryDate).toISOString().slice(0, 7);
        return donationMonth === selectedMonth && donation.status !== "pending"; // Filter out "pending" status
      })
    : donations.filter((donation) => donation.status !== "pending"); // Filter out "pending" status

  if (loading) return <CircularProgress sx={{ mt: 5, mx: "auto", display: "block" }} />;
  if (!user) return <Typography variant="h6">User not found</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>My Profile</Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profileImage}
                  alt={user.fullname}
                  sx={{
                    bgcolor: profileImage ? "transparent" : deepPurple[500],
                    width: 120,
                    height: 120,
                    fontSize: 40,
                  }}
                >
                  {!profileImage && user.fullname?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    boxShadow: 2,
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleImageUpload} disabled={uploading} />
                  {uploading ? <CircularProgress size={24} /> : <PhotoCamera />}
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h6">Full Name</Typography>
              <Typography color="text.secondary">{user.fullname}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Email</Typography>
              <Typography color="text.secondary">{user.email}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Phone</Typography>
              <Typography color="text.secondary">{user.phone}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Address</Typography>
              <Typography color="text.secondary">{user.address}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                {user.role === "restaurant"
                  ? "Restaurant Name"
                  : user.role === "ngo"
                  ? "NGO Name"
                  : user.role === "caterer"
                  ? "Caterer Name"
                  : user.role === "event_planner"
                  ? "Event Planner Name"
                  : "Organization"}
              </Typography>
              <Typography color="text.secondary">{editData.nameByRole}</Typography>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={handleEdit}>
            Edit Profile
          </Button>
        </Paper>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField label="Full Name" fullWidth value={user.fullname} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" fullWidth value={user.email} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Phone" name="phone" fullWidth value={editData.phone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" name="address" fullWidth value={editData.address} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={
                    user.role === "restaurant"
                      ? "Restaurant Name"
                      : user.role === "ngo"
                      ? "NGO Name"
                      : user.role === "caterer"
                      ? "Caterer Name"
                      : user.role === "event_planner"
                      ? "Event Planner Name"
                      : "Name"
                  }
                  name="nameByRole"
                  fullWidth
                  value={editData.nameByRole}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Donation History Section */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Donation History</Typography>

      <Button variant="outlined" onClick={handleFilterOpen} sx={{ mb: 2 }}>
        Filter by Month
      </Button>

      <Dialog open={filterDialogOpen} onClose={handleFilterClose}>
        <DialogTitle>Select Month</DialogTitle>
        <DialogContent>
          <TextField
            type="month"
            label="Month"
            value={selectedMonth}
            onChange={handleMonthChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {loadingDonations ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : donationError ? (
        <Alert severity="error">{donationError}</Alert>
      ) : filteredDonations.length === 0 ? (
        <Alert severity="info">No donations found for selected month.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Food Type</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Expiry Date</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                <TableCell>{donation.foodType}</TableCell>
                <TableCell>{donation.quantity}</TableCell>
                <TableCell>{new Date(donation.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>{donation.location}</TableCell>
                <TableCell>{donation.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
);
};

export default UserProfile;


