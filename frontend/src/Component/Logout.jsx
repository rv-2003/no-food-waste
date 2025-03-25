import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Axios instance
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout API to blacklist the token
      await api.post("/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  return (
    <Button 
      variant="contained" 
      color="error" 
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={{ 
        fontSize: 14, 
        fontWeight: "bold", 
        px: 2, 
        py: 1,
        borderRadius: "8px",
        textTransform: "none"
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;


