import React from "react";
import {
  FaHistory,
  FaMapMarkerAlt,
  FaHeart,
  FaLocationArrow,
} from "react-icons/fa";
import LiveLocation from "./LiveLocation";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <button className="sidebar-btn">
        <FaHistory size={20} /> Recents
      </button>
      <button className="sidebar-btn">
        <FaMapMarkerAlt size={20} /> Add Place
      </button>
      <button className="sidebar-btn">
        <FaHeart size={20} /> Favorites
      </button>
      <LiveLocation />
    </div>
  );
};

export default Sidebar;
