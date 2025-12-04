import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import ClubModal from "../components/ClubModal";
import "../styles/ClubModal.css"; 

export default function ClubsPage({ admin = false }) {
  const [clubs, setClubs] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const apiRoot = (() => {
    const env = process.env.REACT_APP_API_URL;
    if (env) return env.replace(/\/api\/?$/i, "");
    if (api.defaults.baseURL) return api.defaults.baseURL.replace(/\/api\/?$/i, "");
    return window.location.origin;
  })();

  useEffect(() => {
    loadClubs();
    fetchRegistrations();
  }, []);

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clubs");
      setClubs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/club-registrations");
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this club?")) return;
    try {
      await api.delete(`/clubs/${id}`);
      setClubs(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Error deleting club");
    }
  };

  const studentClubRegistrations = user
    ? registrations.filter(reg => reg.user_email === user.email || reg.user_id === user.id)
    : [];
  const recentClubRegistrations = studentClubRegistrations.slice(0, 5);

  return (
    <div className="clubs-page">
      {/* Header */}
      <div className="clubs-header">
        <div className="clubs-header-left">
          <i className={`fa ${admin ? "fa-users-cog" : "fa-users"} clubs-header-icon`}></i>
          <h3 className="clubs-header-title">{admin ? "Manage Sports Club" : "Sports Club"}</h3>
        </div>
        {admin && (
          <button
            className="btn btn-primary add-club-btn"
            onClick={() => { setEditingClub(null); setModalOpen(true); }}
          >
            <i className="fa fa-plus"></i> Add Club
          </button>
        )}
      </div>

      {/* Club List */}
      {loading ? (
        <div className="clubs-loading">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <div className="clubs-empty">
          <p className="clubs-empty-text">No clubs available yet.</p>
          {admin && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <i className="fa fa-plus"></i> Add first club
            </button>
          )}
        </div>
      ) : (
        <div className="club-grid">
          {clubs.map(c => (
            <div className="club-card" key={c.id}>
              <div className="club-image-wrap">
                {c.picture ? (
                  <img
                    src={/^https?:\/\//i.test(c.picture)
                      ? c.picture
                      : c.picture.startsWith("/")
                        ? `${apiRoot}${c.picture}`
                        : `${apiRoot}/uploads/${c.picture}`}
                    alt={c.name}
                    className="club-image"
                  />
                ) : (
                  <div className="club-image-placeholder">No Image</div>
                )}
              </div>
              <div className="club-card-body">
                <h4 className="club-name">{c.name}</h4>
                {c.description && <p className="club-desc">{c.description}</p>}
                {c.achievements && <p className="club-achievements"><strong>Achievements:</strong> {c.achievements}</p>}
                <div className="club-meta">
                  <p><strong>Coach:</strong> {c.coach || "-"}</p>
                  <p><strong>Members:</strong> {c.current_members ?? "-"}</p>
                  <p><strong>Schedule:</strong> {c.training_schedule || "-"}</p>
                </div>
                {admin && (
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-warning" onClick={() => { setEditingClub(c); setModalOpen(true); }}>
                      <i className="fa fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {admin && (
        <ClubModal
          open={modalOpen}
          initialData={editingClub}
          onClose={() => { setModalOpen(false); setEditingClub(null); }}
          onSaved={async () => {
            setModalOpen(false);
            setEditingClub(null);
            await loadClubs();
            await fetchRegistrations();
          }}
        />
      )}

      {/* Recent Registrations */}
      {recentClubRegistrations.length > 0 && !admin && (
        <div className="recent-registrations-section">
          <h4>Your Recent Club Registrations</h4>
          <div className="registrations-grid">
            {recentClubRegistrations.map(reg => (
              <div key={reg.id} className="registration-card">
                <div className="card-header">
                  <h5>{reg.club_name || "Club"}</h5>
                  <span className={`status-badge ${reg.status?.toLowerCase() || "pending"}`}>
                    {reg.status || "Pending"}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Date:</strong> {new Date(reg.created_at).toLocaleDateString()}</p>
                  {reg.reason && <p><strong>Reason:</strong> {reg.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
