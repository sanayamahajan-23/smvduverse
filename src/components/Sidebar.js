import React, { useState } from "react";
import {
  FaHistory,
  FaMapMarkerAlt,
  FaHeart,
  FaLocationArrow,
} from "react-icons/fa";
import LiveLocation from "./LiveLocation";
import "./Sidebar.css";
import Recent from "./Recent";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Library",
    "Cafeteria",
    "Hostel Block",
    "Auditorium",
  ]);

  const toggleSidebar = () => {
    console.log("Toggling sidebar");
    setIsOpen((prev) => !prev); // Toggle state cleanly
  };

  return (
    <div className="sidebar">
      <button className="sidebar-btn" onClick={toggleSidebar}>
        <FaHistory size={20} /> Recents
      </button>
      <button className="sidebar-btn">
        <FaMapMarkerAlt size={20} /> Add Place
      </button>
      <button className="sidebar-btn">
        <FaHeart size={20} /> Favorites
      </button>
      <LiveLocation />

      {/* Render Recent component only when isOpen is true */}
      {isOpen && (
        <Recent
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          recentSearches={recentSearches}
        />
      )}
    </div>
  );
};

export default Sidebar;
