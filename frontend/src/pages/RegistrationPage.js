import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import "../styles/RegistrationPage.css";

export default function RegistrationPage({ admin }) {
  if (admin) {
    return <AdminRegistrationDashboard />;
  }
  return <StudentRegistrationDashboard />;
}

// Student Registration Dashboard with Split Screen
function StudentRegistrationDashboard() {
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [clubForm, setClubForm] = useState({
    name: "",
    email: "",
    studentid: "",
    club_option: "",
  });
  const [activityForm, setActivityForm] = useState({
    name: "",
    email: "",
    studentid: "",
    registration_type: "individual",
    activity_option: "",
  });
  const [clubMessage, setClubMessage] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  const activityOptions = [
    "Basketball Game",
    "Volleyball Game",
    "Badminton Tournament",
    "Table Tennis",
    "Track and Field",
    "Chess Tournament",
    "E-Sports Competition",
  ];

  useEffect(() => {
    fetchClubs();
    fetchRecentRegistrations();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoadingClubs(true);
      // Use the same endpoint as the clubs page
      const response = await api.get("/clubs");
      // Extract id and name from clubs (same data source as clubs page)
      const clubsList = (response.data || []).map(club => ({
        id: club.id,
        name: club.name
      }));
      setClubs(clubsList);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      setClubs([]);
    } finally {
      setLoadingClubs(false);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      const response = await api.get("/registrations/recent");
      const sorted = (response.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentRegistrations(sorted);
    } catch (err) {
      console.error("Error fetching recent registrations:", err);
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setClubMessage("");
    try {
      await api.post("/registrations/club", clubForm);
      window.alert("Club registration submitted successfully!");
      setClubForm({ name: "", email: "", studentid: "", club_option: "" });
      await fetchRecentRegistrations();
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to submit registration");
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setActivityMessage("");
    try {
      await api.post("/registrations/activity", activityForm);
      window.alert("Activity registration submitted successfully!");
      setActivityForm({ name: "", email: "", studentid: "", registration_type: "individual", activity_option: "" });
      await fetchRecentRegistrations();
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to submit registration");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="events-header-left">
          <i class="fa-regular fa-address-card"></i>
          <span className="events-title">Registration</span>
        </div>
      {/* Split Screen Layout */}
      <div className="split-screen-dashboard">
        {/* Club Registration Panel */}
        <div className="split-panel club-panel">
          <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>Club Registration</h3>
          <form className="register-form" onSubmit={handleClubSubmit}>
            <label>Name</label>
            <input
              type="text"
              value={clubForm.name}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              required
            />
            
            <label>Email</label>
            <input
              type="email"
              value={clubForm.email}
              onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
              required
            />
            
            <label>Student ID</label>
            <input
              type="text"
              value={clubForm.studentid}
              onChange={(e) => setClubForm({ ...clubForm, studentid: e.target.value })}
              required
            />
            
            <label>Select Club</label>
            {loadingClubs ? (
              <div style={{ padding: "0.5rem", color: "#666" }}>Loading clubs...</div>
            ) : clubs.length === 0 ? (
              <div style={{ padding: "0.5rem", color: "#dc3545" }}>
                No clubs available. Please contact admin to add clubs.
              </div>
            ) : (
              <select
                value={clubForm.club_option}
                onChange={(e) => setClubForm({ ...clubForm, club_option: e.target.value })}
                required
              >
                <option value="">Choose a club...</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.name}>
                    {club.name}
                  </option>
                ))}
              </select>
            )}
            
            <button type="submit">Register for Club</button>
            {clubMessage && <div className="msg">{clubMessage}</div>}
          </form>
        </div>

        {/* Activities Registration Panel */}
        <div className="split-panel activity-panel">
          <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>Activities Registration</h3>
          <form className="register-form" onSubmit={handleActivitySubmit}>
            <label>Name</label>
            <input
              type="text"
              value={activityForm.name}
              onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
              required
            />
            
            <label>Email</label>
            <input
              type="email"
              value={activityForm.email}
              onChange={(e) => setActivityForm({ ...activityForm, email: e.target.value })}
              required
            />
            
            <label>Student ID</label>
            <input
              type="text"
              value={activityForm.studentid}
              onChange={(e) => setActivityForm({ ...activityForm, studentid: e.target.value })}
              required
            />
            
            <label>Registration Type</label>
            <select
              value={activityForm.registration_type}
              onChange={(e) => setActivityForm({ ...activityForm, registration_type: e.target.value })}
              required
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
            
            <label>Sports Activity</label>
            <select
              value={activityForm.activity_option}
              onChange={(e) => setActivityForm({ ...activityForm, activity_option: e.target.value })}
              required
            >
              <option value="">Choose an activity...</option>
              {activityOptions.map((activity, idx) => (
                <option key={idx} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
            
            <button type="submit">Register for Activity</button>
            {activityMessage && <div className="msg">{activityMessage}</div>}
          </form>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="recent-registrations-panel">
        <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>Recent Registrations</h3>
        {recentRegistrations.length === 0 ? (
          <p>No recent registrations</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name/Activity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations
                .filter(reg => reg.studentid === user?.studentid)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(reg => (
                  <tr key={reg.id}>
                    <td>{reg.type}</td>
                    <td>{reg.name}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          backgroundColor:
                            reg.status === "Approved"
                              ? "#d4edda"
                              : reg.status === "Rejected"
                              ? "#f8d7da"
                              : "#fff3cd",
                          color:
                            reg.status === "Approved"
                              ? "#155724"
                              : reg.status === "Rejected"
                              ? "#721c24"
                              : "#856404",
                        }}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td>{new Date(reg.date).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Admin Registration Dashboard
function AdminRegistrationDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchRegistrations();
  }, [search, typeFilter, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get(`/registrations?${params.toString()}`);
      setRegistrations(response.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, type) => {
    try {
      await api.put(`/registrations/${id}/approve`, { type });
      fetchRegistrations();
    } catch (err) {
      console.error("Error approving registration:", err);
      alert(err.response?.data?.error || "Failed to approve registration");
    }
  };

  const handleReject = async (id, type) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) {
      return;
    }
    try {
      await api.put(`/registrations/${id}/reject`, { type });
      fetchRegistrations();
    } catch (err) {
      console.error("Error rejecting registration:", err);
      alert(err.response?.data?.error || "Failed to reject registration");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="events-header-left">
          <i class="fa-regular fa-address-card"></i>
          <span className="events-title">Manage Registration</span>
        </div>
      {/* Search and Sort Controls */}
      <div className="dashboard-controls" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or student ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ paddingLeft: "2rem" }}
          />
          <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>
            <i className="fa fa-search"></i>
          </span>
        </div>
        <select
          className="sort-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Club">Club</option>
          <option value="Activities">Activities</option>
        </select>
        <select
          className="sort-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Registrations Table */}
      <div className="dashboard-table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : registrations.length === 0 ? (
          <p>No registrations found</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>School ID</th>
                <th>Activity/Club</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={`${reg.registration_type}-${reg.id}`}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.schoolid}</td>
                  <td>{reg.activity_club}</td>
                  <td>{new Date(reg.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        backgroundColor:
                          reg.status === "Approved"
                            ? "#d4edda"
                            : reg.status === "Rejected"
                            ? "#f8d7da"
                            : "#fff3cd",
                        color:
                          reg.status === "Approved"
                            ? "#155724"
                            : reg.status === "Rejected"
                            ? "#721c24"
                            : "#856404",
                      }}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td>
                    {reg.status !== "Approved" && (
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(reg.id, reg.registration_type)}
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    {reg.status !== "Rejected" && (
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(reg.id, reg.registration_type)}
                        title="Reject"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

