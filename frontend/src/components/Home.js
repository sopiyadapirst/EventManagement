import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

export default function Home() {
  return (
    <div className="main-panel">
      <div className="content">
        <img src="/logo.png" alt="PTC Logo" className="ptclogo" />

        <h1>Welcome PTCians</h1>
        <p>Join the ultimate sports community and unleash your athletic potential.</p>

        <Link to="/login" className="join-btn">
          Join Now!!
        </Link>
      </div>
    </div>
  );
}
