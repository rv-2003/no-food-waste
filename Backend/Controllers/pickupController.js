const Donations = require("../Model/DonationModel");
const User = require("../Model/UserModel");
const NGO = require("../Model/ngo");
const pickup=require("../Model/Pickup")

const updatePickupStatus = async (req, res) => {
    try {
      const { donationId } = req.params;
      const { pickedUp, delivered } = req.body;
  
      const pickup = await Pickup.findOne({ where: { donationId } });
      if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  
      if (pickedUp !== undefined) pickup.pickedUp = pickedUp;
      if (delivered !== undefined) pickup.delivered = delivered;
  
      await pickup.save();
  
      // If both are true, mark donation as completed
      if (pickup.pickedUp && pickup.delivered) {
        const donation = await Donation.findByPk(donationId);
        donation.status = 'completed';
        await donation.save();
      }
  
      res.status(200).json({ message: "Pickup status updated", pickup });
    } catch (error) {
      console.error("Error updating pickup", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports= {updatePickupStatus}