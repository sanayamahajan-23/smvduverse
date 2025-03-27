import React, { useEffect, useState } from "react";
import "./MapComponent.css";
import SearchBox from "./SearchBox";
import SidePanel from "./SidePanel";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is missing!");
      return;
    }

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 32.94257, lng: 74.95469 },
          zoom: 17,
          mapTypeControl: false,
          clickableIcons: false,
        }
      );

      setMap(mapInstance);

      const initialMarker = new window.google.maps.Marker({
        position: { lat: 32.94257, lng: 74.95469 },
        map: mapInstance,
        title: "SMVDU Main Entrance",
      });

      setMarker(initialMarker);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const handlePlaceSelect = ({ lat, lng, name, imageUrl, galleryImages }) => {
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(18);

      if (marker) marker.setMap(null);
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        animation: window.google.maps.Animation.DROP,
        title: name,
      });

      setMarker(newMarker);

      setSelectedPlace({
        placeName: name,
        coordinates: { lat, lng },
        imageUrl,
        galleryImages,
      });

      setIsSidePanelOpen(true);
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedPlace(null);
    setIsSidePanelOpen(false);
  };

  return (
    <div>
      <SearchBox
        onPlaceSelect={handlePlaceSelect}
        onCloseSidePanel={handleCloseSidePanel}
        isSidePanelOpen={isSidePanelOpen}
      />
      <div id="map" className="map-container" style={{ width: "100%", height: "500px" }} />
      {selectedPlace && <SidePanel placeData={selectedPlace} />}
    </div>
  );
};

export default MapComponent;
