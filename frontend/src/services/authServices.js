// src/services/authService.js
import api from "../utils/api";
import axios from "axios";

// Set base URL for Axios
axios.defaults.baseURL = "http://localhost:5000";

export const login = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password }); // ✅ Fixed URL
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (fullname, email, password, role) => {
  try {
    const response = await api.post("/auth/register", { fullname, email, password, role });
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);
    throw error;
  }
};
