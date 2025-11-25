import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import "../styles/ProfilePage.css";

export default function ProfilePage({ onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({ fullname: "", email: "", phone: "" });
  const [preview, setPreview] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Load profile on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    api.get("/profile", { headers: { user: JSON.stringify(user) } })
      .then(res => {
        setProfile(res.data);
        setForm({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          phone: res.data.phone || ""
        });
        setPreview(res.data.avatar ? `${apiUrl}${res.data.avatar}` : "/uploads/default-avatar.png");
      })
      .catch(err => console.error(err));
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Submit profile update
  const submit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("User not logged in");

      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      if (avatarFile) fd.append("avatar", avatarFile);

      await api.put("/profile", fd, { headers: { "Content-Type": "multipart/form-data", user: JSON.stringify(user) } });

      alert("Profile updated");

      // Refresh profile
      const res = await api.get("/profile", { headers: { user: JSON.stringify(user) } });
      setProfile(res.data);
      setPreview(res.data.avatar ? `${apiUrl}${res.data.avatar}` : "/uploads/default-avatar.png");

      // Update localStorage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        fullname: res.data.fullname,
        avatar: res.data.avatar
      }));
      // Notify parent to update user state
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
  <div className="profile-full-center">
    <div className="profile-card">
      <div className="profile-avatar">
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <i className="fa fa-user" />
        )}
      </div>

      <div className="profile-name">{form.fullname || "Name"}</div>

      <form className="profile-form" onSubmit={e => { e.preventDefault(); submit(); }}>
        <div>
          <label className="profile-form-label"><i className="fa fa-user" /> Fullname</label>
          <input
            className="profile-form-input"
            type="text"
            placeholder="Full Name"
            value={form.fullname}
            onChange={e => setForm({ ...form, fullname: e.target.value })}
          />
        </div>

        <div>
          <label className="profile-form-label"><i className="fa fa-envelope" /> Email</label>
          <input
            className="profile-form-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="profile-form-label"><i className="fa fa-phone" /> Number</label>
          <input
            className="profile-form-input"
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="profile-form-label"><i className="fa fa-upload" /> Upload</label>
          <div className="profile-form-upload">
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>

        <button className="profile-save-btn" type="submit">Save Profile</button>
      </form>
    </div>
  </div>
);
}
