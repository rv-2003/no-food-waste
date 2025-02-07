import { useState } from "react";
import { 
    Card, Typography, Avatar, Button, Grid, List, ListItem, ListItemText, 
    Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton 
} from "@mui/material";
import { Edit, CameraAlt } from "@mui/icons-material";

export default function UserProfile() {
    // State for user profile data
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        restaurant: "Doe's Diner",
        address: "123 Food Street, New York, NY",
        profilePic: "https://via.placeholder.com/150",
        donations: [
            { id: 1, food: "10 Boxes of Pizza", date: "Feb 5, 2025" },
            { id: 2, food: "15 Meals of Pasta", date: "Jan 20, 2025" },
        ],
    });

    // State for modal visibility
    const [open, setOpen] = useState(false);
    
    // Temporary state for editing user data
    const [editData, setEditData] = useState({ ...user });

    // Handle opening and closing the edit modal
    const handleOpen = () => {
        setEditData({ ...user }); // Reset editData when opening modal
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    // Handle input changes
    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Handle save changes
    const handleSave = () => {
        setUser({ ...editData }); // Update main user state
        setOpen(false);
    };

    // Handle profile picture upload
    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser((prevUser) => ({ ...prevUser, profilePic: imageUrl }));
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {/* Centered Profile Picture with Edit Icon */}
            <Grid container justifyContent="center" position="relative">
                <Avatar src={user.profilePic} sx={{ width: 100, height: 100, mb: 2 }} />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-pic-upload"
                    onChange={handleProfilePicChange}
                />
                <label htmlFor="profile-pic-upload">
                    <IconButton 
                        component="span" 
                        sx={{ position: "absolute", top: 80, right: -10, background: "white" }}
                    >
                        <CameraAlt />
                    </IconButton>
                </label>
            </Grid>

            {/* User Details */}
            <Card sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{user.name}</Typography>
                <Typography variant="body1" color="text.secondary">{user.email}</Typography>
                <Typography variant="body1" color="text.secondary">{user.phone}</Typography>
                
                <Typography variant="h6" sx={{ mt: 2 }}>Restaurant</Typography>
                <Typography variant="body1" color="text.secondary">{user.restaurant}</Typography>
                
                <Typography variant="h6" sx={{ mt: 2 }}>Address</Typography>
                <Typography variant="body1" color="text.secondary">{user.address}</Typography>
                
                <Button variant="contained" startIcon={<Edit />} sx={{ mt: 3 }} onClick={handleOpen}>
                    Edit Profile
                </Button>
            </Card>

            {/* Donation History */}
            <Card sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>Donation History</Typography>
                <List>
                    {user.donations.length > 0 ? (
                        user.donations.map((donation) => (
                            <ListItem key={donation.id} divider>
                                <ListItemText primary={donation.food} secondary={donation.date} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No donations made yet.
                        </Typography>
                    )}
                </List>
            </Card>

            {/* Edit Profile Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth margin="dense" label="Full Name" name="name"
                        value={editData.name} onChange={handleChange}
                    />
                    <TextField 
                        fullWidth margin="dense" label="Email" name="email"
                        value={editData.email} onChange={handleChange}
                    />
                    <TextField 
                        fullWidth margin="dense" label="Phone Number" name="phone"
                        value={editData.phone} onChange={handleChange}
                    />
                    <TextField 
                        fullWidth margin="dense" label="Restaurant Name" name="restaurant"
                        value={editData.restaurant} onChange={handleChange}
                    />
                    <TextField 
                        fullWidth margin="dense" label="Address" name="address"
                        value={editData.address} onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}






 
 