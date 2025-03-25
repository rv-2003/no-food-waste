const session = require("express-session");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./Config/db"); 
const AuthRoutes = require("./Routes/AuthRoutes");
const DonationRoutes = require("./Routes/DonationRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Allow frontend domain and Authorization headers
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Ensure Authorization is allowed
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
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    sameSite: "strict" // Protects against CSRF attacks
  }
}));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/donations", DonationRoutes);

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
sequelize.sync({ alter: process.env.NODE_ENV === "development" }) 
  .then(() => console.log("✅ Database synced successfully"))
  .catch(err => console.error("❌ Database sync error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



  
  