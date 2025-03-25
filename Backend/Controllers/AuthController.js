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

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the temporary user record
      const tempUser = await TempUsers.findOne({ where: { token } });
      if (!tempUser) {
          return res.status(404).json({ msg: "Invalid or expired token" });
      }

      // Check if the user already exists in the Users table
      const userExists = await Users.findOne({ where: { email: tempUser.email } });
      if (userExists) {
          return res.status(400).json({ msg: "User already registered" });
      }

      // Create the user in the Users table
      const newUser = await Users.create({
          fullname: tempUser.fullname,
          email: tempUser.email,
          password: tempUser.password,
          role: tempUser.role,
          verified: true,
      });

      // Delete the temporary record
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
      const user = await Users.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ msg: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ msg: "Invalid email or password" });
      }
  
      const expiresIn = 3600; // 1 hour
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, // ✅ Ensure ID is included
        process.env.JWT_SECRET,
        { expiresIn }
      );
  
      res.json({
        msg: "Login successful",
        token,
        expiresIn,
        user: { id: user.id, email: user.email, role: user.role },
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
module.exports = { registerUser, loginUser, verifyEmail,logoutUser };




