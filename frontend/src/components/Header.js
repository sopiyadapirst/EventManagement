import React from 'react';
import "../styles/Header.css";

export default function Header({ onMenuClick }) {
  const handleMenu = () => {
    if (typeof onMenuClick === 'function') onMenuClick();
  };

  return (
    <header className="header-section">
      <img src="/uploads/ptc.jpg" alt="PTC Banner" className="header-banner" />
      <div className="header-overlay">
        <div className="menubar-inside">
          <button className="header-menu" aria-label="menu" onClick={handleMenu}>
            <i className="fa fa-bars"></i>
          </button>
        </div>

        <img src="/uploads/logo.png" alt="PTC Logo" className="header-logo" />
        <h1 className="header-title">Pateros Technological College</h1>
      </div>
    </header>
  );
}
