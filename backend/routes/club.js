// routes/club.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `club_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clubs");
    // map picture path
    const mapped = rows.map((r) => ({ ...r, picture: r.picture ? `/uploads/${r.picture}` : null }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get club by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clubs WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Club not found" });
    const club = rows[0];
    club.picture = club.picture ? `/uploads/${club.picture}` : null;
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: create club
router.post("/", authenticateToken, authorizeRole("admin"), upload.single("picture"), async (req, res) => {
  const { name, description, achievements, coach, current_members, schedule } = req.body;
  const picture = req.file ? req.file.filename : null;
  const created_by = req.user.id;
  try {
    console.log('Create club request body:', req.body, 'file:', req.file && req.file.filename);
    const [result] = await pool.query(
      "INSERT INTO clubs (name, description, achievements, picture, coach, current_members, training_schedule, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description || null, achievements || null, picture, coach || null, current_members || null, schedule || null, created_by]
    );
    // return the created club
    const [rows] = await pool.query("SELECT * FROM clubs WHERE id = ?", [result.insertId]);
    const club = rows[0];
    club.picture = club.picture ? `/uploads/${club.picture}` : null;
    res.json({ message: "Club created", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: update club
router.put("/:id", authenticateToken, authorizeRole("admin"), upload.single("picture"), async (req, res) => {
  const { name, description, achievements, coach, current_members, schedule } = req.body;
  const picture = req.file ? req.file.filename : null;
  try {
    console.log('Update club request id:', req.params.id, 'body:', req.body, 'file:', req.file && req.file.filename);
    const [rows] = await pool.query("SELECT picture FROM clubs WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    // optionally delete old picture
    if (picture && rows[0].picture) {
      const oldPath = path.join(UPLOAD_DIR, rows[0].picture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await pool.query(
      "UPDATE clubs SET name=?, description=?, achievements=?, picture=COALESCE(?, picture), coach=?, current_members=?, training_schedule=? WHERE id=?",
      [name, description || null, achievements || null, picture, coach || null, current_members || null, schedule || null, req.params.id]
    );
    const [updated] = await pool.query("SELECT * FROM clubs WHERE id = ?", [req.params.id]);
    const club = updated[0];
    club.picture = club.picture ? `/uploads/${club.picture}` : null;
    res.json({ message: "Club updated", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: delete
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT picture FROM clubs WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    if (rows[0].picture) {
      const p = path.join(UPLOAD_DIR, rows[0].picture);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await pool.query("DELETE FROM clubs WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
