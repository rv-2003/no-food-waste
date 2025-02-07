import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, MenuItem } from '@mui/material';

const SignUpCard = () => {
  const [userType, setUserType] = useState('');

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Sign Up
          </Typography>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Select User Type"
            select
            fullWidth
            variant="outlined"
            margin="normal"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <MenuItem value="Restaurant">Restaurant</MenuItem>
            <MenuItem value="NGO">NGO</MenuItem>
            <MenuItem value="Caterer">Caterer</MenuItem>
            <MenuItem value="Event Management Company">Event Management Company</MenuItem>
          </TextField>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUpCard;
