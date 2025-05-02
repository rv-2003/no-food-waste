// src/services/donationService.js
import api from "../utils/api";
import axios from 'axios';  // Add this line to import axios



// Donor: Create Donation
export const createDonation = async (foodType, quantity, expiryDate, location) => {
  try {
    const response = await api.post("/donations/donate", {
      foodType,
      quantity,
      expiryDate,
      location,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error in createDonation:", error.response?.data || error.message);
    throw error;
  }
};

// Donor: Fetch Own Donations (for history/profile)
export const fetchDonations = async () => {
  console.log("Attempting to fetch donations...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found. User needs to log in.");
      throw new Error("No token found. Please log in.");
    }
    console.log("Token found, proceeding with API request.");

    const response = await api.get("/donations/gettingdonations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response received from API:", response); // Log the full response object
    // If the response is successful, return the donations data
    return response.data;
  } catch (error) {
    console.error("❌ Error during donation fetch process:", error.message);

    // Check for specific error cases and provide more context
    if (error.response) {
      // This is a server error (e.g. 401, 500)
      console.error("❌ API Error:", error.response.data || error.message);
      throw new Error(`Error: ${error.response?.status} - ${error.response?.data?.msg || error.message}`);
    } else if (error.request) {
      // This means the request was made but no response was received
      console.error("❌ No response received from server:", error.message);
      throw new Error("Network error: Unable to reach the server. Please try again later.");
    } else {
      // If there is some other error
      console.error("❌ Unexpected Error:", error.message);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const handleCancelDonation = async (donationId, setDonations) => {
  const token = localStorage.getItem("token");

  if (!window.confirm("Are you sure you want to cancel this donation?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/donations/${donationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove the cancelled donation from UI
    setDonations((prev) => prev.filter((d) => d.id !== donationId));
  } catch (error) {
    console.error("Error cancelling donation:", error.response?.data || error.message);
  }
};



// NGO: Fetch Nearby Donors (Google Map)
// Example: on NGO dashboard load or after getting location
// NGO: Fetch Nearby Donors (Google Map)
// donationServices.js
export const getNearbyDonors = async (latitude, longitude) => {
  console.log("🌍 Sending coordinates to backend:", latitude, longitude);
  try {
    const response = await api.post("/ngo/nearby-donors", { latitude, longitude });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching nearby donors:", error.response?.data || error.message);
    throw error;
  }
};



export const fetchDonationRequests = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const response = await api.get(`/ngo/${userId}/donation-requests`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { radius: 20 },
    });

    if (!response.data || !Array.isArray(response.data.donationRequests)) {
      throw new Error("Invalid response format: donationRequests missing.");
    }

    return response.data.donationRequests;
  } catch (error) {
    console.error("❌ Error in fetchDonationRequests:", error.response?.data || error.message);
    throw error;
  }
};

// NGO: Accept a donation (only one NGO can accept it)
export const handleAcceptDonation = async (donationId) => {
  const token = localStorage.getItem("token");
  console.log("🚀 Accepting donation ID:", donationId);

  try {
    const res = await api.patch(`/ngo/donations/${donationId}/accept`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.donation || res.data;
  } catch (error) {
    console.error("❌ Error accepting donation:", error.response?.data || error.message);
    throw error;
  }
};

// NGO: Decline a donation (only hidden for current NGO)
export const declineDonation = async (donationId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await api.post(
      `/ngo/donations/decline-donation`,
      { donationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("❌ Error declining donation:", error.response?.data || error.message);
    throw error;
  }
};


// Function to mark the donation as picked up
export const handlePickUpDonation = async (donationId, token) => {
  try {
    // Make the API request to update the donation status to 'picked up'
    const response = await api.patch(
      `/ngo/donations/${donationId}/ngo-status`, 
      {
        status: 'picked up',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    // Return success response
    return response.data;
  } catch (error) {
    console.error("Error marking as picked up:", error);
    throw new Error("An error occurred while marking the donation as picked up.");
  }
};


