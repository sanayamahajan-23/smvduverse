import React from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";
import "./Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <div className="navigation-container" style={{ border: "3px solid red" }}>
      <button
        onClick={() => navigate("/smvdu-map")}
        className="back-button"
        style={{ display: "block" }}
      >
        🔙
      </button>
      <Sidebar /> {/* Sidebar with buttons */}
      <MapComponent />
    </div>
  );
};

export default Navigation;
