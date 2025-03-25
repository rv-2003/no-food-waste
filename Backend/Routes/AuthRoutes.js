const express = require("express");
const { registerUser, loginUser, verifyEmail, logoutUser } = require("../Controllers/AuthController");
const { verifyToken } = require("../Middleware/Auth"); // ✅ Import middleware
const router = express.Router();
const Users = require('../Model/UserModel');


// ✅ Register (Signup)
router.post("/register", registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Verify Email
router.get("/verify/:token", verifyEmail);

// ✅ Logout
router.post("/logout", logoutUser);

router.get("/user", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("🔹 User ID from token:", userId);
  
      if (!userId) {
        return res.status(400).json({ msg: "Invalid token - User ID missing" });
      }
  
      // ✅ Use "Users" (not "User")
      const user = await Users.findOne({ where: { id: userId }, attributes: ["fullname"] });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.json({ username: user.fullname }); // Use fullname from DB
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
  });
  
module.exports = router;




