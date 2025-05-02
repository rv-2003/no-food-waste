const session = require("express-session");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./Config/db.js"); 
const AuthRoutes = require("./Routes/AuthRoutes");
const DonationRoutes = require("./Routes/DonationRoutes");
const UserProfile = require("./Routes/UserProfile"); // ✅ Fixed import
const ngoRoutes = require('./Routes/NGO');
const User=require('./Model/UserModel');
const Donation=require('./Model/DonationModel');
const NGO=require('./Model/ngo');
const Pickup=require('./Model/Pickup');




// ✅ User to NGO (One-to-One)
User.hasOne(NGO, { foreignKey: 'userId', as: 'NGOProfile', onDelete: 'CASCADE' });
NGO.belongsTo(User, { foreignKey: 'userId', as: 'UserAccount' });

// ✅ User to Donation (One-to-Many)
User.hasMany(Donation, { foreignKey: 'userId', as: 'Donations' });
Donation.belongsTo(User, { foreignKey: 'userId', as: 'Donor' });

// ✅ Donation to Pickup (One-to-Many)
Donation.hasMany(Pickup, { foreignKey: 'donationId', as: 'Pickups' });
Pickup.belongsTo(Donation, { foreignKey: 'donationId', as: 'DonationDetails' });

// ✅ NGO to Pickup (One-to-Many)
NGO.hasMany(Pickup, { foreignKey: 'ngoId', as: 'NGOPickups' });
Pickup.belongsTo(NGO, { foreignKey: 'ngoId', as: 'AssignedNGO' });

// ✅ Donor to Pickup (One-to-Many)
User.hasMany(Pickup, { foreignKey: 'donorId', as: 'DonorPickups' });
Pickup.belongsTo(User, { foreignKey: 'donorId', as: 'DonorUser' });



module.exports = {
  User,
  Donation,
  NGO,
  Pickup,
};

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ CORS Configuration (Multiple Allowed Origins)
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Express-session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your_default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  }
}));
const path = require("path");

// Serve static files from the 'upload' folder
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/donations", DonationRoutes);
app.use("/api/users", UserProfile); // ✅ Fixed import

app.use('/api/ngo', ngoRoutes);
// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the No Food Waste Backend!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error"
  });
});

// Database Sync (Avoid data loss in production)
sequelize.sync()
  .then(() => console.log("✅ Database synced successfully"))
  .catch(err => console.error("❌ Database sync error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




  
  