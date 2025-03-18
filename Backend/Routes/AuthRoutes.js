const express = require("express");
const { registerUser, loginUser, verifyEmail } = require("../Controllers/AuthController");

const router = express.Router();

// ✅ Register (Signup)
router.post("/register", registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Verify Email
router.get("/verify/:token", verifyEmail);

module.exports = router;


