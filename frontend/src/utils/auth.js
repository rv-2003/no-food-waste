// src/utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // ✅ Use localStorage
  return !!token; // Return true if token exists
};

export const logout = () => {
  localStorage.removeItem("token"); // ✅ Use localStorage
  localStorage.removeItem("expiresAt");
  window.location.href = "/login"; // Redirect to login page
};

