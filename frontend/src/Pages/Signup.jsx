import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value); // Debugging log
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Debugging log

    // Check if any field is empty
    if (!formData.fullname || !formData.email || !formData.password || !formData.role) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(response.data.message);
      navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
      alert("Signup failed. Try again.");
      console.error("Error:", error.response ? error.response.data : error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ backgroundColor: "#fff", padding: "20px", marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h5">Signup</Typography>

          {/* Full Name Input */}
          <TextField
            label="Full Name"
            name="fullname"
            fullWidth
            margin="normal"
            value={formData.fullname}
            onChange={handleChange}
          />

          {/* Email Input */}
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Role Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={(e) => handleChange({ target: { name: "role", value: e.target.value } })}
            >
              <MenuItem value="restaurant">Restaurant</MenuItem>
              <MenuItem value="ngo">NGO</MenuItem>
              <MenuItem value="caterer">Caterer</MenuItem>
              <MenuItem value="charity">Charity</MenuItem>
            </Select>
          </FormControl>

          {/* Signup Button */}
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Signup
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}


