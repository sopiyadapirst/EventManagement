// routes/clubRegistration.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middlewares/auth");

// Submit registration (students)
// New schema: id, club_id, club_name, name, email, studentId, user_id, date, status
// Schema: id, user_id, student_id, club_id, reason, created_at
router.post("/", authenticateToken, async (req, res) => {
  const { club_option, name, email, student_id } = req.body;
  if (!club_option || !name || !email || !student_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await pool.query(
      "INSERT INTO club_registration (club_option, name, email, student_id, created_at) VALUES (?, ?, ?, ?, NOW())",
      [club_option, name, email, student_id]
    );
    res.json({ message: "Club registration submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: view all registrations
router.get("/", authenticateToken, async (req, res) => {
  try {
    // admins and students both can view but students only see their own
    if (req.user.role === "admin") {
      const [rows] = await pool.query("SELECT cr.*, u.fullname as student_name, c.name as club_name FROM club_registration cr JOIN users u ON cr.user_id = u.id JOIN clubs c ON cr.club_id = c.id ORDER BY cr.created_at DESC");
      res.json(rows);
    } else {
      const [rows] = await pool.query("SELECT cr.*, c.name as club_name FROM club_registration cr JOIN clubs c ON cr.club_id = c.id WHERE cr.user_id = ? ORDER BY cr.created_at DESC", [req.user.id]);
      res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
