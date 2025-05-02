const NGO = require('../Model/ngo');
const User = require('../Model/UserModel');
const Pickup = require('../Model/Pickup');
const Donation = require("../Model/DonationModel");
const DonationNGOStatus = require('../Model/DonationNGOStatus');
const { Op, literal } = require("sequelize");

// Create NGO Profile - (Name unchanged)
const createNGOProfile = async (req, res) => {
  try {
    const { userId, organizationName, registrationNumber, contactPerson, contactPhone, operatingAreas, capacityPerDay, location } = req.body;

    if (!userId || !organizationName || !registrationNumber || !location) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userId, organizationName, registrationNumber, location' 
      });
    }

    const existingNGO = await NGO.findOne({ where: { userId } });
    if (existingNGO) {
      return res.status(400).json({ 
        success: false,
        message: 'NGO profile already exists for this user' 
      });
    }

    const ngo = await NGO.create({
      userId,
      organizationName,
      registrationNumber,
      contactPerson,
      contactPhone,
      operatingAreas,
      capacityPerDay,
      location,
    });

    res.status(201).json({ 
      success: true,
      message: 'NGO profile created successfully',
      data: ngo 
    });

  } catch (error) {
    console.error("Error in createNGOProfile:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create NGO profile',
      error: error.message 
    });
  }
};

// Get NGO Profile by userId - (Name unchanged)
const getNGOProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID parameter is required' 
      });
    }

    const ngo = await NGO.findOne({
      where: { userId },
      include: [{ 
        model: User, 
        attributes: ['fullname', 'email', 'phone', 'address', 'profilePic'] 
      }]
    });

    if (!ngo) {
      return res.status(404).json({ 
        success: false,
        message: 'NGO profile not found for this user' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: ngo 
    });

  } catch (error) {
    console.error("Error in getNGOProfile:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch NGO profile',
      error: error.message 
    });
  }
};

// Update NGO Profile - (Name unchanged)
const updateNGOProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID parameter is required' 
      });
    }

    const [updated] = await NGO.update(updateData, { 
      where: { userId } 
    });

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'NGO profile not found' 
      });
    }

    const updatedProfile = await NGO.findOne({ where: { userId } });

    res.status(200).json({ 
      success: true,
      message: 'NGO profile updated successfully',
      data: updatedProfile 
    });

  } catch (error) {
    console.error("Error in updateNGOProfile:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update NGO profile',
      error: error.message 
    });
  }
};

// Get All NGOs - (Name unchanged)
const getAllNGOs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await NGO.findAndCountAll({
      attributes: ['id', 'organizationName', 'location', 'capacityPerDay', 'verificationStatus'],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({ 
      success: true,
      count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows 
    });

  } catch (error) {
    console.error("Error in getAllNGOs:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch NGOs',
      error: error.message 
    });
  }
};

// Get All Pickups for NGO - (Name unchanged)
const getAllPickupsForNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;

    if (!ngoId) {
      return res.status(400).json({ 
        success: false,
        message: 'NGO ID parameter is required' 
      });
    }

    const pickups = await Pickup.findAll({
      where: { ngoId },
      include: [{ 
        model: Donation,
        include: [{
          model: User,
          as: 'Donor',
          attributes: ['fullname', 'email', 'phone']
        }]
      }]
    });

    res.status(200).json({ 
      success: true,
      count: pickups.length,
      data: pickups 
    });

  } catch (error) {
    console.error("Error in getAllPickupsForNGO:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pickups',
      error: error.message 
    });
  }
};

// Get Nearby Donors - (Name unchanged)
const getNearbyDonors = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const radius = parseFloat(req.query.radius) || 5;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false,
        message: 'Latitude and longitude are required' 
      });
    }

    const userId = req.user.id;
    const ngo = await NGO.findOne({ where: { userId } });

    if (!ngo) {
      return res.status(404).json({ 
        success: false,
        message: 'NGO not found' 
      });
    }

    // Update NGO location
    ngo.location = `${latitude},${longitude}`;
    await ngo.save();

    const ngoCoords = [latitude, longitude];
    const donations = await Donation.findAll({
      where: { status: 'Pending' },
      include: [{
        model: User,
        as: 'Donor',
        attributes: ['id', 'fullname', 'email']
      }]
    });

    const nearby = donations.filter(donation => {
      if (!donation.location) return false;
      
      const donorCoords = donation.location.split(',').map(Number);
      if (donorCoords.length !== 2 || donorCoords.some(isNaN)) return false;
      
      const distance = haversineDistance(ngoCoords, donorCoords);
      return distance <= radius;
    });

    res.status(200).json({ 
      success: true,
      count: nearby.length,
      data: nearby 
    });

  } catch (error) {
    console.error("Error in getNearbyDonors:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to find nearby donors',
      error: error.message 
    });
  }
};

function isWithinRadius(coord1, coord2, radiusKm = 10) {
  const toRad = deg => (deg * Math.PI) / 180;

  const [lat1, lon1] = coord1.map(Number);
  const [lat2, lon2] = coord2.map(Number);

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusKm;
}


// Get Donation Requests for NGO - (Name unchanged)
const getDonationRequestsForNGO = async (req, res) => {
  try {
    const userId = req.user.id; // this is your userId
    const ngo = await NGO.findOne({ where: { userId } });

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const ngoId = ngo.id; // this is your ngoId (c022c17a-610a-44f6-80a1-4bda7b521ee3)
    const [lat, lng] = ngo.location.split(',').map(Number);

    // Get all donation IDs declined by this NGO
    const statusRecords = await DonationNGOStatus.findAll({
      where: { ngoId }
    });

    const declinedDonationIds = statusRecords
      .filter(r => r.status === 'declined')
      .map(r => r.donationId);

    // Fetch all donations (Pending and Accepted) by this NGO
    const allDonations = await Donation.findAll({
      where: {
        [Op.or]: [
          { status: 'Pending' },
          { status: 'accepted', acceptedBy: ngoId } // Filter by accepted donations by this NGO
        ],
        id: { [Op.notIn]: declinedDonationIds } // Exclude declined donations
      },
      include: [
        { model: User, as: 'Donor', attributes: ['fullname'] }
      ]
    });

    const filteredDonations = allDonations.filter(donation => {
      const [donLat, donLng] = donation.location.split(',').map(Number);
      return isWithinRadius([lat, lng], [donLat, donLng], 20);
    });

    res.status(200).json({ success: true, donationRequests: filteredDonations });

  } catch (error) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markAsPickedUp = async (req, res) => {
  const { donationId } = req.params; // Get donationId from URL parameters

  try {
    // Find the donation by donationId
    const donation = await Donation.findByPk(donationId);

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Check if the NGO has already picked up the donation
    if (donation.ngo_status === 'picked up') {
      return res.status(400).json({ msg: "Donation has already been marked as picked up." });
    }

    // Update the NGO's status to 'picked up'
    donation.ngo_status = "picked up";

    // Save the donation
    await donation.save();

    // Send success response
    res.status(200).json({ msg: "Donation marked as picked up", donation });
  } catch (err) {
    console.error("Error updating donation status:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};




// Get Available Donations for NGO - (Name unchanged)
const getAvailableDonationsForNGO = async (ngoId) => {
  try {
    const declinedDonations = await DonationNGOStatus.findAll({
      where: { ngoId, status: 'declined' },
      attributes: ['donationId'],
    });

    const declinedIds = declinedDonations.map(item => item.donationId);

    const availableDonations = await Donation.findAll({
      where: {
        id: { [Op.notIn]: declinedIds },
        status: 'Pending'
      }
    });

    return availableDonations;

  } catch (error) {
    console.error("Error in getAvailableDonationsForNGO:", error);
    throw error;
  }
};

module.exports = {
  createNGOProfile,
  getNGOProfile,
  updateNGOProfile,
  getAllNGOs,
  getAllPickupsForNGO,
  getNearbyDonors,
  getDonationRequestsForNGO,
  getAvailableDonationsForNGO,
  markAsPickedUp,
};