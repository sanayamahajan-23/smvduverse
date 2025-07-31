import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import SidePanel from "../components/sidebar";
import SearchBox from "../components/Searchbox";
import SignIn from "../components/signin";
import SidePanelPlaceInfo from "../components/SidePanelPlaceInfo";
import GalleryPanel from "../components/GalleryPanel";
import DirectionsPanel from "../components/DirectionsPanel";
import { FaDirections } from "react-icons/fa";

// Mapbox Access Token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtZDhpYTh1ZzAwbGsybHNiNjM5MmRwbHYifQ.AP29da_1J7sJ1g4pRP4F9Q";

// Centered coordinates for SMVDU
const smvduCoords = [74.95410062342953, 32.9422867698961];

const NavigationPage = ({ user }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [destFromPanel, setDestFromPanel] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Initialize map on mount
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: smvduCoords,
      zoom: 16,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => mapRef.current.remove();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: 20,
        }}
      >
        <SidePanel />
      </div>

      {/* SearchBox */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "80px",
          zIndex: 30,
        }}
      >
        {user ? (
          <SearchBox
            mapRef={mapRef}
            user={user}
            onPlaceSelect={(place) => {
              setSelectedPlace(place);
              setGalleryVisible(false); // Close gallery on new selection
            }}
          />
        ) : (
          <SignIn />
        )}
      </div>

      {/* Floating Directions Button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "320px", // adjust depending on search box width
          zIndex: 30,
        }}
      >
      <button className="back-button" onClick={() => navigate("/smvdu-map")}
        >
        ← Back
      </button>
        <button
          style={{
            backgroundColor: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
          onClick={() => setShowDirectionsPanel(true)}
        >
          <FaDirections size={16} />
          Directions
        </button>
      </div>

      {/* Place Info Panel */}
      {selectedPlace && (
        <SidePanelPlaceInfo
          place={selectedPlace}
          user={user}
          onGalleryOpen={(photos) => {
            setGalleryImages(photos);
            setGalleryVisible(true);
          }}
          onClose={() => setSelectedPlace(null)}
          onDirections={(coords) => {
            setDestFromPanel(`${coords.lat},${coords.lng}`);
            setShowDirectionsPanel(true);
          }}
        />
      )}

      {/* Directions Panel */}
      {showDirectionsPanel && (
        <DirectionsPanel
          mapRef={mapRef}
          destination={destFromPanel}
          onClose={() => setShowDirectionsPanel(false)}
        />
      )}

      {/* Gallery Panel */}
      {galleryVisible && galleryImages.length > 0 && (
        <GalleryPanel
          photos={galleryImages}
          onClose={() => setGalleryVisible(false)}
        />
      )}
    </div>
  );
};

export default NavigationPage;
