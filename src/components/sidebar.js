import React, { useState } from 'react';
import NearbyPlaces from './NearbyPlaces';
import Recents from './Recents';
import Favorites from './Favorites';
import ShareLiveLocation from './ShareLiveLocation';
import "./sidebar.css"
import { useNavigate } from 'react-router-dom';
import { FaClock, FaStar, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [shareActive, setShareActive] = useState(true);
  const navigate = useNavigate();
  const handleTabClick = (tab) => {
    if (tab === 'share') {
      setShareActive(true); // reset active state
    }
    setActiveTab(tab);
  };
  const handleNavigateNearby = () => {
   navigate('/nearby');};

  const renderPanel = () => {
    switch (activeTab) {
      case 'recents':
        return <Recents />;
      case 'favorites':
        return <Favorites />;
      case 'nearby':
        return <NearbyPlaces />;
      case 'share':
        return shareActive ? (
          <ShareLiveLocation onHide={() => setShareActive(false)} />
        ) : (
          <div className="text-gray-500 p-4"></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar-container">
      <div className="button-list">
        <button onClick={() => setActiveTab('recents')}><FaClock className="icon" />Recents</button>
        <button onClick={() => setActiveTab('favorites')}><FaStar className="icon" />Favorites</button>
       <button onClick={handleNavigateNearby}><FaMapMarkerAlt className="icon" />Nearby Places</button>
        <button onClick={() => handleTabClick('share')}><FaShareAlt className="icon" />Share Live Location</button>
      </div>
      <div className="panel-content">
        {renderPanel()}
      </div>
    </div>
  );
};

export default Sidebar;
