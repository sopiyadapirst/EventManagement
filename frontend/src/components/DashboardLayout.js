import React, { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Header from "./Header";
import StudentHome from "../pages/StudentHome";
import AdminHome from "../pages/AdminHome";
import ClubsPage from "../pages/ClubsPage";
import ClubRegistrationPage from "../pages/ClubsRegistrationPage";
import ActivitiesRegistrationPage from "../pages/ActivitiesRegistrationPage";
import EventsPage from "../pages/EventsPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import ProfilePage from "../pages/ProfilePage";
import "../styles/Dashboard.css";

export default function DashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [active, setActive] = useState("home");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    setActive("home");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderMain = () => {
    if (!user) return <div>Please login</div>;
    if (user.role === "admin") {
      switch (active) {
        case "home": return <AdminHome />;
        case "club": return <ClubsPage admin />;
        case "registration": return <ActivitiesRegistrationPage admin />;
        case "event": return <EventsPage admin />;
        case "announcement": return <AnnouncementsPage admin />;
        case "profile": return <ProfilePage />;
        default: return <AdminHome />;
      }
    } else {
      switch (active) {
        case "home": return <StudentHome />;
        case "club": return <ClubsPage />;
        case "registration": return (
          <div>
            <ClubRegistrationPage />
            <ActivitiesRegistrationPage />
          </div>
        );
        case "event": return <EventsPage />;
        case "announcement": return <AnnouncementsPage />;
        case "profile": return <ProfilePage />;
        default: return <StudentHome />;
      }
    }
  };

  return (
    <div className="dashboard-root">
      <Header onMenuClick={() => setSidebarVisible(v => !v)} />

      <div className="dashboard-body">
        {sidebarVisible && <DashboardSidebar user={user} role={user?.role} active={active} onChange={setActive} onLogout={handleLogout} />}

        <main className="main-content">
          {renderMain()}
        </main>
      </div>
    </div>
  );
}
