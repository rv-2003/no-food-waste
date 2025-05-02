import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const NGOHeader = ({ username, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome, {username}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onLogout} color="inherit">
            <LogoutIcon />
          </IconButton>
          <Avatar>{username?.[0]?.toUpperCase()}</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NGOHeader;
