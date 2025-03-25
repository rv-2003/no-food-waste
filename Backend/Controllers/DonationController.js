const Donations = require("../Model/DonationModel");

// Create a new donation
const createDonation = async (req, res) => {
  const { foodType, quantity, expiryDate, location } = req.body;
  const userId = req.user.id;

  try {
    const donation = await Donations.create({
      userId,
      foodType,
      quantity,
      expiryDate,
      location,
    });
    res.json({ msg: "Donation created successfully", donation });
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get donation history for the logged-in user
const getDonations = async (req, res) => {
  const userId = req.user.id;

  try {
    const donations = await Donations.findAll({ where: { userId } });
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { createDonation, getDonations };