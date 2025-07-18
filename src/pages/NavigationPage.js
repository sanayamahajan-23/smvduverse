// NavigationPage.js
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import SidePanel from "../components/sidebar";
import SearchBox from "../components/Searchbox";
import SignIn from "../components/signin";
import SidePanelPlaceInfo from "../components/SidePanelPlaceInfo";
import GalleryPanel from "../components/GalleryPanel";

// Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtZDhpYTh1ZzAwbGsybHNiNjM5MmRwbHYifQ.AP29da_1J7sJ1g4pRP4F9Q";

const smvduCoords = [74.95410062342953, 32.9422867698961];

const NavigationPage = ({ user }) => {
  const mapContainerRef = useRef(null); // DOM container
  const mapRef = useRef(null); // Map instance
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  
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
      {/* Map background container */}
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

      {/* SearchBox next to sidebar */}
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
              setGalleryOpen(false); // Reset gallery on new selection
            }}
          />
        ) : (
          <SignIn />
        )}
      </div>

      {/* Place Info Side Panel */}
      {selectedPlace && (
        <SidePanelPlaceInfo
          place={selectedPlace}
          user={user}
          onGalleryOpen={(photos) => {
            setGalleryImages(photos);
            setGalleryVisible(true);
          }}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Gallery Panel */}
      {galleryOpen && selectedPlace && (
        <GalleryPanel
          place={selectedPlace}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default NavigationPage;
