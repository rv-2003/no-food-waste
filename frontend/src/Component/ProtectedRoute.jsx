import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");

  console.log("🔹 Checking authentication in ProtectedRoute...");
  console.log("Token from localStorage:", token);
  console.log("ExpiresAt from localStorage:", expiresAt);

  if (!token || !expiresAt) {
    console.warn("❌ No token or expiration time found");
    return false;
  }

  if (Date.now() > parseInt(expiresAt, 10)) {
    console.warn("❌ Token expired");
    localStorage.clear(); // Clear expired token
    return false;
  }

  console.log("✅ Authentication successful");
  return true;
};

const ProtectedRoute = ({ element }) => {
  const auth = isAuthenticated();
  console.log("🔹 Auth status in ProtectedRoute:", auth);

  return auth ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;


