import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authServices";
import { handleError } from "../utils/errorHandler";
import api from "../utils/api";

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
    setLoading(true);
    setError("");
  
    try {
      const response = await login(email, password);
      const { token, user } = response;
  
      if (!token || !user) {
        throw new Error("No token or user data received");
      }
  
      // 🆕 Decode the token to extract the expiration time
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = decodedToken.exp * 1000; // convert to ms
  
      // 📝 Store everything
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresAt", expiresAt); // ← Add this line
  
      // Navigate by role
      switch(user.role) {
        case 'ngo':
          navigate("/ngo-dashboard");
          break;
        case 'restaurant':
        case 'caterer':
        case 'event_planner':
          navigate("/dashboard");
          break;
        default:
          navigate("/");
          console.warn("Unknown user role:", user.role);
      }
  
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
    } finally {
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
            required
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
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            onClick={handleLogin}
            disabled={loading || !email || !password}
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