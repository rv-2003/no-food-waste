const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/Auth");
const {updatePickupStatus}=require("../Controllers/pickupController")

router.patch("/:donationId/pickup-status", verifyToken, updatePickupStatus);

module.export= router;