import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authServices";
import { handleError } from "../utils/errorHandler";
import api from "../utils/api"; // ✅ Ensure this import is present

import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    console.log("🔹 Login button clicked"); // Step 1: Button clicked
    setLoading(true);
    setError("");
  
    try {
      console.log("🔹 Sending request to backend..."); // Step 2: Before API request
      const response = await api.post("/auth/login", { email, password });
  
      console.log("✅ Server Response:", response.data); // Step 3: After receiving response
  
      const { token } = response.data;
      if (!token) {
        console.error("❌ No token received from server");
        throw new Error("No token received from server");
      }
  
      const expiresIn = 3600 * 1000; // 1 hour (or whatever your backend sets)
      const expiresAt = Date.now() + expiresIn;
  
      // 🔹 Store token and expiration in localStorage instead of sessionStorage
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiresAt.toString()); // ✅ Store expiresAt
  
      console.log("✅ Token stored in localStorage:", token);
      console.log("✅ ExpiresAt stored in localStorage:", expiresAt); // Debugging
  
      console.log("🔹 Navigating to dashboard...");
      navigate("/dashboard"); // Step 4: Navigation attempt
  
    } catch (err) {
      console.error("❌ Login Error:", err.response || err);
      setError(err.response?.data?.msg || "Login failed. Try again.");
    } finally {
      console.log("🔹 Finished login process");
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Card sx={{ width: 350, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link href="/signup" underline="hover">
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginCard;








