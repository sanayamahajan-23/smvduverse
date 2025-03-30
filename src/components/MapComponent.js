import React, { useEffect, useState } from "react";
import "./MapComponent.css";
import SearchBox from "./SearchBox";
import SidePanel from "./SidePanel";
import DirectionsPanel from "./DirectionsPanel"; // Import the DirectionsPanel

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [directionsVisible, setDirectionsVisible] = useState(false); // Toggle directions panel

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is missing!");
      return;
    }

    const loadGoogleMaps = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          setGoogleLoaded(true);
          initMap();
        };
      } else {
        setGoogleLoaded(true);
        initMap();
      }
    };

    const initMap = () => {
      if (window.google) {
        const mapInstance = new window.google.maps.Map(
          document.getElementById("map"),
          {
            center: { lat: 32.941854, lng: 74.953907 },
            zoom: 17,
            mapTypeControl: false,
            clickableIcons: false,
          }
        );

        setMap(mapInstance);

        const initialMarker = new window.google.maps.Marker({
          position: { lat: 32.941854, lng: 74.953907 },
          map: mapInstance,
          title: "SMVDU Entrance",
        });

        setMarker(initialMarker);
      }
    };

    loadGoogleMaps();
  }, []);

  const handlePlaceSelect = ({
    coordinates,
    placeName,
    imageUrl,
    galleryImages,
  }) => {
    if (!coordinates || isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
      console.error("Invalid coordinates received:", coordinates);
      return;
    }

    if (map) {
      console.log("Moving to:", coordinates.lat, coordinates.lng);

      map.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      map.setZoom(18);

      if (marker) marker.setMap(null);

      const newMarker = new window.google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map,
        animation: window.google.maps.Animation.DROP,
        title: placeName,
      });

      setMarker(newMarker);

      setSelectedPlace({
        placeName,
        coordinates,
        imageUrl,
        galleryImages,
      });

      setIsSidePanelOpen(true);
      setDirectionsVisible(true); // Show directions panel when a place is selected
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedPlace(null);
    setIsSidePanelOpen(false);
  };

  return (
    <div>
      <SearchBox
        googleLoaded={googleLoaded}
        onPlaceSelect={handlePlaceSelect}
        onCloseSidePanel={handleCloseSidePanel}
        isSidePanelOpen={isSidePanelOpen}
      />
      <div id="map" className="map-container" />
      {selectedPlace && (
        <SidePanel placeData={selectedPlace} onClose={handleCloseSidePanel} />
      )}

      {/* Render DirectionsPanel only when needed */}
      {directionsVisible && selectedPlace && (
        <DirectionsPanel
          destination={selectedPlace.coordinates}
          placeName={selectedPlace.placeName}
          onClose={() => setDirectionsVisible(false)}
          map={map} // Pass the map instance
        />
      )}
    </div>
  );
};

export default MapComponent;
