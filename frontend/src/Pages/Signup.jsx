// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { register } from "../services/authServices";
// import { handleError } from "../utils/errorHandler";
// import CircularProgress from '@mui/material/CircularProgress';
// import {
//   Container,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Alert,
// } from "@mui/material";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     fullname: "",
//     email: "",
//     password: "",
//     role: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     const { fullname, email, password, role } = formData;
//     if (!fullname || !email || !password || !role) {
//       setError("All fields are required.");
//       return false;
//     }
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address.");
//       return false;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setError("");

//     try {
//       await register(formData.fullname, formData.email, formData.password, formData.role);
//       alert("Registration successful! Please log in.");
//       navigate("/login");
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
//       setError(errorMessage);
//       handleError(err, "Signup");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Card style={{ backgroundColor: "#fff", padding: "20px", marginTop: "20px" }}>
//         <CardContent>
//           <Typography variant="h5">Signup</Typography>

//           {error && <Alert severity="error">{error}</Alert>}

//           <TextField
//             label="Full Name"
//             name="fullname"
//             fullWidth
//             margin="normal"
//             value={formData.fullname}
//             onChange={handleChange}
//             disabled={loading}
//           />

//           <TextField
//             label="Email"
//             name="email"
//             type="email"
//             fullWidth
//             margin="normal"
//             value={formData.email}
//             onChange={handleChange}
//             disabled={loading}
//           />

//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={formData.password}
//             onChange={handleChange}
//             disabled={loading}
//           />

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Role</InputLabel>
//             <Select
//               name="role"
//               value={formData.role}
//               onChange={(e) => handleChange({ target: { name: "role", value: e.target.value } })}
//               disabled={loading}
//             >
//               <MenuItem value="restaurant">Restaurant</MenuItem>
//               <MenuItem value="ngo">NGO</MenuItem>
//               <MenuItem value="caterer">Caterer</MenuItem>
//               <MenuItem value="charity">Charity</MenuItem>
//             </Select>
//           </FormControl>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Signup"}
//           </Button>

//           <Typography variant="body2" style={{ marginTop: "10px", textAlign: "center" }}>
//             Already have an account? <Link to="/login">Log in here</Link>.
//           </Typography>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default Signup;






import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import { handleError } from "../utils/errorHandler";
import CircularProgress from "@mui/material/CircularProgress";
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
  Alert,
} from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the register API
      const response = await register(
        formData.fullname,
        formData.email,
        formData.password,
        formData.role
      );

      // If registration is successful, show an alert
      alert(
        "Registration successful! Please check your email and click on the link to verify your account."
      );

      // Optionally, navigate to the login page
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      handleError(err, "Signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ backgroundColor: "#fff", padding: "20px", marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h5">Signup</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Full Name"
            name="fullname"
            fullWidth
            margin="normal"
            value={formData.fullname}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={(e) =>
                handleChange({ target: { name: "role", value: e.target.value } })
              }
              disabled={loading}
            >
              <MenuItem value="restaurant">Restaurant</MenuItem>
              <MenuItem value="ngo">NGO</MenuItem>
              <MenuItem value="caterer">Caterer</MenuItem>
              <MenuItem value="Event Planner">Event Planner</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Signup"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;

