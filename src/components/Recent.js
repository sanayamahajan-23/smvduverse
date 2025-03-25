import React from "react";
import { FaTimes } from "react-icons/fa";
import "./Recent.css";

const Recent = ({ isOpen, toggleSidebar, recentSearches }) => {
  console.log("Recent sidebar state:", isOpen); // Debug the state here

  return (
    <div className={`recent-sidebar ${isOpen ? "open" : ""}`}>
      <button
        className="close-btn"
        onClick={() => {
          console.log("Close button clicked!"); // Ensure this logs
          toggleSidebar(); // Fire the state update
        }}
      >
        <FaTimes size={20} />
      </button>
      <h2>Recent Searches</h2>
      <ul>
        {recentSearches.length > 0 ? (
          recentSearches.map((search, index) => <li key={index}>{search}</li>)
        ) : (
          <li>No recent searches</li>
        )}
      </ul>
    </div>
  );
};

export default Recent;
