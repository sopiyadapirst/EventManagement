// routes/registration.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

// Get all registrations (for admin)
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { search, type, status } = req.query;
    
    // Build query for club registrations
    // Database: club_registration table with columns: id, user_id, club_option, name, email, student_id, status, created_at
    let clubQuery = `
      SELECT 
        id,
        'Club' as registration_type,
        name,
        email,
        student_id as schoolid,
        club_option as activity_club,
        status,
        created_at as date
      FROM club_registration
      WHERE 1=1
    `;
    const clubParams = [];
    
    // Build query for activities registrations
    // Database: activities_registration table with columns: id, user_id, registration_type, name, email, school_id, activity_option, status, created_at
    let activityQuery = `
      SELECT 
        id,
        'Activities' as registration_type,
        name,
        email,
        school_id as schoolid,
        activity_option as activity_club,
        status,
        created_at as date
      FROM activities_registration
      WHERE 1=1
    `;
    const activityParams = [];
    
    // Apply search filter
    if (search) {
      clubQuery += ` AND (name LIKE ? OR student_id LIKE ?)`;
      clubParams.push(`%${search}%`, `%${search}%`);
      
      activityQuery += ` AND (name LIKE ? OR school_id LIKE ?)`;
      activityParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      clubQuery += ` AND status = ?`;
      clubParams.push(status);
      activityQuery += ` AND status = ?`;
      activityParams.push(status);
    }

    // Get both types
    const [clubs] = await pool.query(clubQuery, clubParams);
    const [activities] = await pool.query(activityQuery, activityParams);

    let allRegistrations = [...clubs, ...activities];

    // Apply type filter after fetching
    if (type && type !== 'all') {
      if (type === 'Club') {
        allRegistrations = clubs;
      } else if (type === 'Activities') {
        allRegistrations = activities;
      }
    }

    // Sort by date (newest first)
    allRegistrations = allRegistrations.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allRegistrations);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// Get recent registrations for student dashboard
router.get("/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's club registrations from club_registration table
    const [clubRegs] = await pool.query(
      `SELECT 
        id,
        'Club' as type,
        club_option as name,
        status,
        created_at as date
      FROM club_registration 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10`,
      [userId]
    );
    
    // Get user's activities registrations from activities_registration table
    const [activityRegs] = await pool.query(
      `SELECT 
        id,
        'Activities' as type,
        activity_option as name,
        status,
        created_at as date
      FROM activities_registration 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10`,
      [userId]
    );
    
    // Combine and sort
    const recent = [...clubRegs, ...activityRegs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ).slice(0, 10);
    
    res.json(recent);
  } catch (err) {
    console.error("Error fetching recent registrations:", err);
    res.status(500).json({ error: "Failed to fetch recent registrations" });
  }
});

// Register for a club
// Database: club_registration (user_id, club_option, name, email, student_id, status)
router.post("/club", authenticateToken, async (req, res) => {
  try {
    const { name, email, studentid, club_option } = req.body;
    const userId = req.user.id;
    
    if (!name || !email || !studentid || !club_option) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const [result] = await pool.query(
      `INSERT INTO club_registration (user_id, name, email, student_id, club_option, status) 
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [userId, name, email, studentid, club_option]
    );
    
    res.json({ 
      message: "Club registration submitted successfully", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error registering for club:", err);
    res.status(500).json({ error: "Failed to register for club" });
  }
});

// Register for an activity
// Database: activities_registration (user_id, registration_type, name, email, school_id, activity_option, status)
router.post("/activity", authenticateToken, async (req, res) => {
  try {
    const { name, email, studentid, registration_type, activity_option } = req.body;
    const userId = req.user.id;
    
    if (!name || !email || !studentid || !registration_type || !activity_option) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (!['individual', 'team'].includes(registration_type)) {
      return res.status(400).json({ error: "Invalid registration type. Must be 'individual' or 'team'" });
    }
    
    const [result] = await pool.query(
      `INSERT INTO activities_registration 
       (user_id, name, email, school_id, registration_type, activity_option, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [userId, name, email, studentid, registration_type, activity_option]
    );
    
    res.json({ 
      message: "Activity registration submitted successfully", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error registering for activity:", err);
    res.status(500).json({ error: "Failed to register for activity" });
  }
});

// Admin: Approve registration
router.put("/:id/approve", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'Club' or 'Activities'
    
    if (!type || !['Club', 'Activities'].includes(type)) {
      return res.status(400).json({ error: "Invalid registration type" });
    }
    
    const table = type === 'Club' ? 'club_registration' : 'activities_registration';
    
    const [result] = await pool.query(
      `UPDATE ${table} SET status = 'Approved' WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    
    res.json({ message: "Registration approved" });
  } catch (err) {
    console.error("Error approving registration:", err);
    res.status(500).json({ error: "Failed to approve registration" });
  }
});

// Admin: Reject registration
router.put("/:id/reject", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'Club' or 'Activities'
    
    if (!type || !['Club', 'Activities'].includes(type)) {
      return res.status(400).json({ error: "Invalid registration type" });
    }
    
    const table = type === 'Club' ? 'club_registration' : 'activities_registration';
    
    // Update status to Rejected instead of deleting
    const [result] = await pool.query(
      `UPDATE ${table} SET status = 'Rejected' WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    
    res.json({ message: "Registration rejected" });
  } catch (err) {
    console.error("Error rejecting registration:", err);
    res.status(500).json({ error: "Failed to reject registration" });
  }
});

// Admin: Delete registration
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'Club' or 'Activities'
    if (!type || !['Club', 'Activities'].includes(type)) {
      return res.status(400).json({ error: "Invalid registration type" });
    }
    const table = type === 'Club' ? 'club_registration' : 'activities_registration';
    const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json({ message: "Registration deleted" });
  } catch (err) {
    console.error("Error deleting registration:", err);
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

// Get available clubs (for dropdown)
router.get("/clubs/list", async (req, res) => {
  try {
    const [clubs] = await pool.query("SELECT id, name FROM clubs ORDER BY name");
    res.json(clubs);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
});

module.exports = router;