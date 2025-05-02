import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";

const DonationRequestList = ({
  requests,
  onAccept,
  onDecline,
  markAsPickedUp,
  hoveredRequestId,
  setHoveredRequestId,
  addressMap,
}) => {
  const handleHover = (requestId) => {
    setHoveredRequestId(requestId);
  };

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Incoming Donation Requests
      </Typography>
      <List>
        {requests?.length === 0 ? (
          <Typography>No donation requests.</Typography>
        ) : (
          requests.map((req) => (
            <ListItem
              key={req.id}
              disableGutters
              sx={{ mb: 2 }}
              onMouseEnter={() => handleHover(req.id)}
              onMouseLeave={() => handleHover(null)}
            >
              <Card
                sx={{
                  width: "100%",
                  backgroundColor:
                    hoveredRequestId === req.id
                      ? "rgba(0, 0, 0, 0.04)"
                      : "inherit",
                  transition: "background-color 0.3s ease",
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    Food: {req.foodType || req.foodName}
                  </Typography>
                  <Typography variant="body2">
                    Quantity: {req.quantity}
                  </Typography>
                  <Typography variant="body2">
                    Donor: {req.Donor?.fullname || "Unknown"}
                  </Typography>
                  <Typography variant="body2">
                    Location: {addressMap?.[req.id] || "Resolving..."}
                  </Typography>
                  <Typography variant="body2">
                    Status: {req.status}
                  </Typography>

                  {req.status === "accepted" ? (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 1 }}
                      onClick={() => markAsPickedUp(req.id)}
                    >
                      Mark as Picked Up
                    </Button>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => onAccept(req.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onDecline(req.id)}
                      >
                        Decline
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

// Make sure you're exporting the component like this:
export default DonationRequestList;
