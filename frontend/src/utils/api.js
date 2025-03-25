import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Ensure cookies are sent/received
});

// ✅ Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Switched to localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("token"); // ✅ Clear localStorage on 401
      localStorage.removeItem("expiresAt");
      window.location.href = "/login"; // ✅ Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;

