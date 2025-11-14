// routes/announcement.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

// list
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT a.*, u.fullname as posted_by FROM announcements a LEFT JOIN users u ON a.posted_by = u.id ORDER BY a.created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// admin create
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { title, message } = req.body;
  try {
    const [result] = await pool.query("INSERT INTO announcements (title, message, posted_by, created_at) VALUES (?, ?, ?, NOW())", [title, message, req.user.id]);
    res.json({ message: "Announcement posted", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
