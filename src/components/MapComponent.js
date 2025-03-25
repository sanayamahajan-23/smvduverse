import React, { useEffect, useState } from "react";
import "./MapComponent.css";
import SearchBox from "./SearchBox";
import SidePanel from "./SidePanel";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;

    script.onload = () => {
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

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
    }
  };

  return (
    <div>
      <SearchBox onPlaceSelect={handlePlaceSelect} />
      <div id="map" className="map-container" />
      {selectedPlace && <SidePanel placeData={selectedPlace} />}
    </div>
  );
};

export default MapComponent;
