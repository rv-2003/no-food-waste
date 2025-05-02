const Donations = require("../Model/DonationModel");
const User = require("../Model/UserModel");
const NGO = require("../Model/ngo");
const DonationNGOStatus =require("../Model/DonationNGOStatus")
// Create a new donation
const createDonation = async (req, res) => {
  const {foodType,quantity,expiryDate,location} = req.body;
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
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: Missing user ID" });
    }

    const donations = await Donations.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(donations);
  } catch (err) {
    console.error("Error in getDonations:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



const deleteDonation = async (req, res) => {
  const donationId = req.params.id;
  const userId = req.user.id;

  try {
    const donation = await Donations.findOne({ where: { id: donationId, userId } });

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found or not authorized" });
    }

    await donation.destroy();

    return res.status(200).json({ msg: "Donation deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting donation:", err);
    return res.status(500).json({ msg: "Server error while deleting donation" });
  }
};



// PATCH /api/ngo/donations/:donationId/accept
const acceptDonation = async (req, res) => {
  const { donationId } = req.params;
  const userId = req.user.id;
  const ngo = await NGO.findOne({ where: { userId } });

  if (!ngo) {
    return res.status(404).json({ error: 'NGO not found' });
  }

  const ngoId = ngo.id; // this is your ngoId (c022c17a-610a-44f6-80a1-4bda7b521ee3)
  const donation = await Donations.findByPk(donationId);

  if (!donation) {
    return res.status(400).json({ success: false, message: "Invalid donation" });
  }

  if (donation.acceptedByNGOId) {
    return res.status(400).json({ success: false, message: "Already accepted donation" });
  }

  // Check if NGO is allowed (e.g., distance check, previously declined, etc.)
  const alreadyDeclined = await DonationNGOStatus.findOne({
    where: { donationId, ngoId }
  });
  if (alreadyDeclined) {
    return res.status(400).json({ success: false, message: "This NGO declined this donation" });
  }

  donation.acceptedBy= ngoId;
  donation.status = "accepted";
  await donation.save();

  return res.json({ success: true, donation });
};



const declineDonation = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ where: { userId: req.user.id } }); // Use req.user.id here
    const ngoId = ngo.id;  // Get the correct ngoId
    
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    const { donationId } = req.body;

    // Ensure the donation exists and is still pending
    const donation = await Donations.findByPk(donationId);
    if (!donation || donation.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Donation not found or already processed' });
    }

    // Record the decline in the DonationNGOStatus table
    await DonationNGOStatus.create({
      donationId: donationId,
      ngoId: ngoId,  // Correct ngoId here
      status: 'declined',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(200).json({ success: true, message: 'Donation declined for this NGO' });
  } catch (error) {
    console.error('Decline donation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update donor status (Mark as Delivered)
const markAsDelivered = async (req, res) => {
  const { donationId } = req.params;  // Get donationId from URL parameters
  

  

  try {
    // Find the donation by donationId
    const donation = await Donations.findByPk(donationId);

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Update the donor's status to 'delivered'
    donation.donor_status = "delivered";

    // Save the donation
    await donation.save();

    res.status(200).json({ msg: "Donation marked as delivered", donation });
  } catch (err) {
    console.error("Error updating donation status:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  createDonation,
  getDonations,
  acceptDonation,
  deleteDonation,
  declineDonation, 
  markAsDelivered,
};