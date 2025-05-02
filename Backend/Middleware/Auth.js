const jwt = require("jsonwebtoken");

// ✅ Store blacklisted tokens
const blacklistedTokens = new Set();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No token provided"); // Debugging
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
        console.log("❌ Token is blacklisted"); // Debugging
        return res.status(403).json({ msg: "Session expired. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Store decoded user
        console.log("✅ Decoded User:", decoded); // Debugging
        next();
    } catch (error) {
        console.error("❌ Token Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            blacklistedTokens.add(token);
            return res.status(403).json({ msg: "Session expired. Please log in again." });
        }

        return res.status(403).json({ msg: "Invalid token" });
    }
};

module.exports = { verifyToken, blacklistedTokens };



