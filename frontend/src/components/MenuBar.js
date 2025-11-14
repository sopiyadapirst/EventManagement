import React from "react";

export default function Menubar({ onToggle }) {
  return (
    <div className="menubar">
      <button onClick={onToggle}><i className="fa fa-bars"></i></button>
    </div>
  );
}
