const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/Auth");
const { createDonation, getDonations } = require("../Controllers/DonationController");

// Create a new donation
router.post("/donate", verifyToken, createDonation);

// Get donation history for the logged-in user
router.get("/gettingdonations", verifyToken, getDonations);

module.exports = router;