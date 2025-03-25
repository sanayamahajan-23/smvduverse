import React from "react";
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";
import "./Navigation.css";

const Navigation = () => {
  return (
    <div className="navigation-container">
      <Sidebar /> {/* Sidebar with buttons */}
      <MapComponent />
    </div>
  );
};

export default Navigation;
