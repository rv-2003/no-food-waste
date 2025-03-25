const jwt = require("jsonwebtoken");

// ✅ Use Set to store blacklisted tokens
const blacklistedTokens = new Set();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  // ✅ Check if token is blacklisted
  if (blacklistedTokens.has(token)) {
    return res.status(403).json({ msg: "Session expired. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This should contain `id` as a UUID
    console.log("✅ Decoded User:", req.user); // Debugging
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    res.status(403).json({ msg: "Invalid token" });
  }
};

// ✅ Role-Based Access Middleware
const checkRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

// ✅ Consistent Exports
module.exports = { verifyToken, blacklistedTokens, checkRole };


