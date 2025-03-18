import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";

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
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
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
      <Card sx={{ width: 350, p: 3, boxShadow: 3 }}>
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
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
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








