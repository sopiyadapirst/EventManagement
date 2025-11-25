import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import "../styles/AnnouncementsPage.css"; // new css file

export default function AnnouncementsPage({ admin=false }) {
  const [ann, setAnn] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/announcements").then(r => setAnn(r.data)).catch(e => console.error(e));
  }, []);

  const post = async () => {
    if (!form.title || !form.message) return alert("Title and message required");
    try {
      await api.post("/announcements", form);
      setForm({ title: "", message: "" });
      const r = await api.get("/announcements");
      setAnn(r.data);
    } catch {
      alert("Error posting");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnn(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Error deleting");
    }
  };

  return (
    <div className="announcements-page">

      {/* Header */}
      <div className="ann-header">
        <div className="ann-header-left">
          <i className="fa fa-bullhorn ann-header-icon" />
          <span className="ann-header-title">Manage Announcements</span>
        </div>

        {admin && (
          <button className="announcement-add-btn" onClick={() => setShowModal(true)}>
            <i className="fa fa-plus" /> Add Announcement
          </button>
        )}
      </div>

      {/* MODAL */}
      {admin && showModal && (
        <div className="announcement-modal-overlay">
          <div className="announcement-modal">
            <div className="announcement-modal-header">
              <i className="fa fa-bullhorn" /> Add New Announcement
              <button className="announcement-modal-close" onClick={() => setShowModal(false)}>
                <i className="fa fa-times" />
              </button>
            </div>

            <form
              className="announcement-modal-form"
              onSubmit={e => { e.preventDefault(); post(); setShowModal(false); }}
            >
              <div>
                <label><i className="fa fa-heading" /> Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Announcement Title"
                />
              </div>

              <div>
                <label><i className="fa fa-align-left" /> Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Message"
                  rows={3}
                />
              </div>

              <div className="announcement-modal-actions">
                <button className="announcement-modal-btn" type="submit">
                  <i className="fa fa-save" /> Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="announcement-list">
        {ann.map(a => (
          <div key={a.id} className="announcement-card">

            <div className="announcement-card-header">
              <i className="fa fa-bullhorn announcement-card-icon" />
              <span className="announcement-title">{a.title}</span>
            </div>

            <div className="announcement-description">{a.message}</div>

            <div className="announcement-meta">
              <i className="fa fa-user" /> {a.posted_by || "Admin"} &nbsp;
              <i className="fa fa-calendar" /> {new Date(a.created_at).toLocaleString()}
            </div>

            {admin && (
              <button className="announcement-delete-btn" onClick={() => remove(a.id)}>
                <i className="fa fa-trash" /> Delete
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
