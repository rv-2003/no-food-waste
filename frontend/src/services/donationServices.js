// src/services/donationService.js
import api from "../utils/api";

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

export const fetchDonations = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ Switched to localStorage
    console.log("🟢 Fetch Donations - Token:", token); // ✅ Debugging

    if (!token) throw new Error("No token found. Please log in.");

    const response = await api.get("/donations/gettingdonations", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error in fetchDonations:", error.response?.data || error.message);
    throw error;
  }
};

