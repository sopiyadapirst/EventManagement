import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser, logoutUser } from './utils/auth';
import DashboardSidebar from './components/DashboardSidebar';
import AdminHome from './components/admin/AdminHome';
import AdminClub from './components/admin/AdminClub';
import AdminRegistration from './components/admin/AdminRegistration';
import AdminEvent from './components/admin/AdminEvent';
import AdminAnnouncement from './components/admin/AdminAnnouncement';
import AdminProfile from './components/admin/AdminProfile';
import './styles/Dashboard.css';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { path: 'home', label: 'Home', icon: 'fa-home' },
    { path: 'club', label: 'Club', icon: 'fa-users' },
    { path: 'registration', label: 'Registration', icon: 'fa-clipboard-list' },
    { path: 'event', label: 'Event', icon: 'fa-calendar' },
    { path: 'announcement', label: 'Announcement', icon: 'fa-bullhorn' },
    { path: 'profile', label: 'Profile', icon: 'fa-user-circle' },
    { path: 'logout', label: 'Logout', icon: 'fa-sign-out-alt' }
  ];

  return (
    <div className="dashboard">
      <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} menuItems={menuItems} userRole="admin" logout={logoutUser} />
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
          <h1>Admin Dashboard</h1>
          <div className="user-info"><i className="fa-solid fa-user-shield"></i><span>{user.fullname}</span></div>
        </div>

        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="club" element={<AdminClub />} />
            <Route path="registration" element={<AdminRegistration />} />
            <Route path="event" element={<AdminEvent />} />
            <Route path="announcement" element={<AdminAnnouncement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
