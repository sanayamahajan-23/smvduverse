import React, { useEffect, useState } from "react";
import { FaTimes, FaHistory } from "react-icons/fa";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "./Recent.css";

const Recent = ({ isOpen, toggleSidebar, onRecentSelect  = () => {} }) => { 
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const loadRecentSearchesFromFirestore = async () => {
      try {
        const q = query(
          collection(db, "recentSearches"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const searches = querySnapshot.docs.map((doc) => doc.data());
        setRecentSearches(searches);
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    if (isOpen) loadRecentSearchesFromFirestore();
  }, [isOpen]);

  return (
    <div className={`recent-sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        <FaTimes size={20} />
      </button>
      <h2>Recent Searches</h2>
      <ul>
        {recentSearches.length > 0 ? (
          recentSearches.map((search, index) => (
            <li
              key={index}
              className="recent-item"
              onClick={() => {
                console.log("Selected Place ID:", search.placeId);
                 console.log("Selected Place Name:", search.name);
                onRecentSelect(search.placeId, search.name);
                setTimeout(() => toggleSidebar(), 200);
                // toggleSidebar(); // Close sidebar after selecting a location
              }}
            >
              <FaHistory size={16} /> {search.name}
            </li>
          ))
        ) : (
          <li>No recent searches</li>
        )}
      </ul>
    </div>
  );
};

export default Recent;
