// routes/event.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

// list events
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY event_date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// admin add
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { title, description, venue, event_date, start_time } = req.body;
  const created_by = req.user.id;
  try {
    const [result] = await pool.query(
      "INSERT INTO events (title, description, venue, event_date, start_time, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, venue, event_date, start_time, created_by]
    );
    res.json({ message: "Event added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// admin delete
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM events WHERE id=?", [req.params.id]);
    res.json({ message: "Event removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
