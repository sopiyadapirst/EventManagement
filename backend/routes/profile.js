// routes/profile.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// get profile
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, fullname, email, phone, avatar, role FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const u = rows[0];
    u.avatar = u.avatar ? `/uploads/${u.avatar}` : null;
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update profile (name, email optional)
router.put("/", authenticateToken, upload.single("avatar"), async (req, res) => {
  const { fullname, email, phone } = req.body;
  const avatar = req.file ? req.file.filename : null;
  try {
    // if email change check uniqueness
    if (email) {
      const [ex] = await pool.query("SELECT id FROM users WHERE email = ? AND id <> ?", [email, req.user.id]);
      if (ex.length) return res.status(400).json({ error: "Email already in use" });
    }

    // fetch old avatar
    const [old] = await pool.query("SELECT avatar FROM users WHERE id = ?", [req.user.id]);
    if (avatar && old[0].avatar) {
      const oldPath = path.join(UPLOAD_DIR, old[0].avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await pool.query("UPDATE users SET fullname = COALESCE(?, fullname), email = COALESCE(?, email), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar) WHERE id = ?", [fullname, email, phone, avatar, req.user.id]);

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
