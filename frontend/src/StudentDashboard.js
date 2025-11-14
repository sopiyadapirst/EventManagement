import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser, logoutUser } from './utils/auth';
import DashboardSidebar from './components/DashboardSidebar';
import StudentHome from './components/student/StudentHome';
import StudentClub from './components/student/StudentClub';
import StudentRegistration from './components/student/StudentRegistration';
import StudentEvent from './components/student/StudentEvent';
import StudentAnnouncement from './components/student/StudentAnnouncement';
import StudentProfile from './components/student/StudentProfile';
import './styles/Dashboard.css';

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();

  if (!user || user.role !== 'student') {
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
      <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} menuItems={menuItems} userRole="student" logout={logoutUser} />
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
          <h1>Student Dashboard</h1>
          <div className="user-info"><i className="fa-solid fa-user-circle"></i><span>{user.fullname}</span></div>
        </div>

        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="home" element={<StudentHome />} />
            <Route path="club" element={<StudentClub />} />
            <Route path="registration" element={<StudentRegistration />} />
            <Route path="event" element={<StudentEvent />} />
            <Route path="announcement" element={<StudentAnnouncement />} />
            <Route path="profile" element={<StudentProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
