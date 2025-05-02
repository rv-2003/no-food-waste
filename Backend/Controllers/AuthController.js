const { sequelize, pool } = require("../Config/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../Utils/SendEmail");
const Users = require("../Model/UserModel");
const TempUsers = require("../Model/TempUserModel");

// User Signup(Register)
const registerUser = async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password || !role) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if user already exists (in Users or TempUsers)
    const userExists = await Users.findOne({ where: { email } });
    const tempUserExists = await TempUsers.findOne({ where: { email } });

    if (userExists || tempUserExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Save user data to TempUsers table
    await TempUsers.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      token,
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    res.json({ msg: "Registration successful! Please check your email to verify your account." });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const NGO = require("../Model/ngo"); // <-- add at top

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tempUser = await TempUsers.findOne({ where: { token } });
    if (!tempUser) {
      return res.status(404).json({ msg: "Invalid or expired token" });
    }

    const userExists = await Users.findOne({ where: { email: tempUser.email } });
    if (userExists) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // ✅ Create new user
    const newUser = await Users.create({
      fullname: tempUser.fullname,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      verified: true,
      role_name: "" // Optional: set dynamically later
    });

    // ✅ Automatically create NGO profile if role is "ngo"
    if (tempUser.role === "ngo") {
      await NGO.create({
        userId: newUser.id,
        organizationName: `${tempUser.fullname}'s Organization`, // or prompt later
        contactPerson: tempUser.fullname,
        contactPhone: "", // can be updated by user later
        registrationNumber: "TEMP-" + Date.now(), // or leave null
        operatingAreas: "",
        location: "0,0",
        capacityPerDay: 0
      });
    }

    await TempUsers.destroy({ where: { id: tempUser.id } });

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const user = await Users.findOne({ 
      where: { email },
      attributes: [
        "id", 
        "fullname", 
        "email", 
        "password", 
        "phone", 
        "address", 
        "profilePic", 
        "role", 
        ["role_name", "roleName"]
      ]
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const expiresIn = 3600; // 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      msg: "Login successful",
      token,
      expiresIn,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        roleName: user.roleName 
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

let blacklistedTokens = []; // Temporary blacklist storage (use Redis for production)

const logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    blacklistedTokens.push(token); // Blacklist the token
  }

  res.json({ msg: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, verifyEmail, logoutUser };