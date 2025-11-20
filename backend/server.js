// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Disable dotenv tips/logs
dotenv.config({ debug: false });

const authRoutes = require("./routes/auth");
const clubRoutes = require("./routes/club");
const clubRegRoutes = require("./routes/clubRegistration");
const activitiesRegRoutes = require("./routes/activitiesRegistration");
const eventRoutes = require("./routes/event");
const announcementRoutes = require("./routes/announcement");
const profileRoutes = require("./routes/profile");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

// Routes
app.use("/api", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/club-registration", clubRegRoutes);
app.use("/api/activities-registration", activitiesRegRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/profile", profileRoutes);


// Unified registrations endpoint
const db = require("./db");
app.get("/api/registrations", async (req, res) => {
	try {
		// Activities registrations
		const [activities] = await db.query("SELECT id, registration_type, name, email, school_id, activity_option, status, created_at FROM activities_registration");
		// Club registrations
		const [clubs] = await db.query("SELECT id, club_option, name, email, student_id, created_at FROM club_registration");
		// Map activities
		const activitiesMapped = activities.map(r => ({
			id: r.id,
			type: r.registration_type || "Activities",
			name: r.name,
			email: r.email,
			schoolId: r.school_id,
			activity: r.activity_option,
			status: r.status || "Pending",
			date: r.created_at
		}));
		// Map clubs
		const clubsMapped = clubs.map(r => ({
			id: r.id,
			type: "Club",
			club_option: r.club_option,
			name: r.name,
			email: r.email,
			studentId: r.student_id,
			date: r.created_at
		}));
		// Merge and sort by date desc
		const allRegs = [...activitiesMapped, ...clubsMapped].sort((a, b) => new Date(b.date) - new Date(a.date));
		res.json(allRegs);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch registrations" });
	}
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
