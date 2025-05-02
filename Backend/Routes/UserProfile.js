const express = require("express");
const multer = require("multer");
const path = require("path");
const Users = require("../Model/UserModel");
const { verifyToken } = require("../Middleware/Auth");
const router = express.Router();

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id, {
            attributes: [
                "fullname", 
                "email", 
                "phone", 
                "address", 
                "profilePic", 
                "role", 
                ["role_name", "roleName"]
            ],
        });
        res.json(user || { message: "User not found" });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update user profile (optimized)
router.put("/update", verifyToken, async (req, res) => {
    try {
        const { nameByRole, ...otherData } = req.body;
        
        const [updated] = await Users.update(
            { 
                ...otherData,
                role_name: nameByRole 
            }, 
            { 
                where: { id: req.user.id },
                returning: true,
                individualHooks: true
            }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await Users.findByPk(req.user.id, {
            attributes: [
                "fullname", 
                "email", 
                "phone", 
                "address", 
                "profilePic", 
                "role", 
                ["role_name", "roleName"]
            ],
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Profile picture upload (unchanged)
const storage = multer.diskStorage({
    destination: "./upload/",
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post("/upload-profile-pic", verifyToken, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profilePicPath = `/upload/${req.file.filename}`;
        await Users.update(
            { profilePic: profilePicPath }, 
            { where: { id: req.user.id } }
        );

        res.json({ profilePic: profilePicPath });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;