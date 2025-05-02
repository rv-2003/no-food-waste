const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/Auth");
const {
  createNGOProfile,
  getNGOProfile,
  updateNGOProfile,
  getAllNGOs,
  getAllPickupsForNGO,
  getNearbyDonors,
  getDonationRequestsForNGO,markAsPickedUp
  
} = require("../Controllers/NgoController");

const { acceptDonation ,declineDonation} = require("../Controllers/DonationController");
// Place specific routes first
router.get("/all", verifyToken, getAllNGOs);
router.post("/create", verifyToken, createNGOProfile);
router.post("/nearby-donors", verifyToken, getNearbyDonors);
router.patch("/donations/:donationId/accept", verifyToken, acceptDonation);
// Decline donation route (specific to this NGO only)
router.post("/donations/decline-donation", verifyToken, declineDonation);
router.patch('/donations/:donationId/ngo-status', verifyToken, markAsPickedUp);



// This must be before `/:userId`
router.get("/:userId/donation-requests", verifyToken, getDonationRequestsForNGO);
router.get("/:ngoId/pickups", verifyToken, getAllPickupsForNGO);

// These go last
router.get("/profile/:userId", verifyToken, getNGOProfile);
router.put("/profile/:userId", verifyToken, updateNGOProfile);
router.get("/:userId", verifyToken, getNGOProfile); // Consider removing this if redundant

module.exports = router;


