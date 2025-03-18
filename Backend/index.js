const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./Config/db"); // Import sequelize
const AuthRoutes = require("./Routes/AuthRoutes");
const User = require("./Model/UserModel.js"); // Ensure paths are correct
const TempUsers = require("./Model/TempUserModel");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow frontend domain or all (*)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", AuthRoutes);

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

// Sync Database (Avoid accidental schema alterations in production)
sequelize.sync({ alter: process.env.NODE_ENV === "development" }) 
  .then(() => console.log("✅ Database synced successfully"))
  .catch(err => console.error("❌ Database sync error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


  
  