// routes/activitiesRegistration.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middlewares/auth");

// CREATE - Student Registration
// New schema: id, name, email, schoolId, activity, option, date, status
// Schema: id, registration_type, name, email, school_id, activity_option, status, created_at
router.post("/", authenticateToken, async (req, res) => {
  const { registration_type, name, email, school_id, activity_option } = req.body;
  if (!registration_type || !name || !email || !school_id || !activity_option) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO activities_registration (registration_type, name, email, school_id, activity_option, status, created_at) VALUES (?, ?, ?, ?, ?, 'Pending', NOW())",
      [registration_type, name, email, school_id, activity_option]
    );
    res.json({ message: "Activity registration saved", id: result.insertId });
  } catch (err) {
    console.error("Error creating registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// READ - Get All Registrations
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin gets all registrations
      const [rows] = await pool.query(
        "SELECT * FROM activities_registration ORDER BY created_at DESC"
      );
      return res.json(rows);
    } else {
      // Students get only their own registrations
      const [rows] = await pool.query(
        "SELECT * FROM activities_registration WHERE email = ? ORDER BY created_at DESC",
        [req.user.email]
      );
      return res.json(rows);
    }
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE - Approve/Reject Registration
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Only admin can update status
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await pool.query(
      "UPDATE activities_registration SET status = ? WHERE id = ?",
      [status, id]
    );
    
    res.json({ message: `Registration ${status.toLowerCase()}` });
  } catch (err) {
    console.error("Error updating registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Remove Registration
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  // Only admin can delete
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    await pool.query(
      "DELETE FROM activities_registration WHERE id = ?",
      [id]
    );
    
    res.json({ message: "Registration deleted" });
  } catch (err) {
    console.error("Error deleting registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
