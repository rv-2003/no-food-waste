const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/Auth");
const { createDonation, getDonations ,deleteDonation,markAsDelivered} = require("../Controllers/DonationController");


// Create a new donation
router.post("/donate", verifyToken, createDonation);

// Get donation history for the logged-in user
router.get("/gettingdonations", verifyToken, getDonations);
router.delete('/:id', verifyToken, deleteDonation);
router.patch('/:donationId/donor-status',markAsDelivered);
module.exports = router;