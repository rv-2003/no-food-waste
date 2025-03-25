import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";
import LogoutButton from "../Component/Logout.jsx";
import api from "../utils/api"; // Axios instance
import { useNavigate } from "react-router-dom";

const DonorDashboardHeader = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(response.data.username);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1565C0", px: 3, boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/profile")}>
          <Avatar sx={{ bgcolor: "white", color: "#1565C0", width: 40, height: 40, fontSize: 20, mr: 1 }}>
            {username ? username.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            {username ? `Welcome, ${username}` : "Loading..."}
          </Typography>
        </Box>

        {/* Logout Button */}
        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
};

export default DonorDashboardHeader;





