// Updated NavigationPage.js
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import SidePanel from "../components/sidebar";
import SearchBox from "../components/Searchbox";
import SignIn from "../components/signin";
import SidePanelPlaceInfo from "../components/SidePanelPlaceInfo";
import GalleryPanel from "../components/GalleryPanel";
import DirectionsPanel from "../components/DirectionsPanel";
import PhotoSphere from "../components/PhotoSphereBasic";
import { FaDirections } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtZDhpYTh1ZzAwbGsybHNiNjM5MmRwbHYifQ.AP29da_1J7sJ1g4pRP4F9Q";

const smvduCoords = [74.95410062342953, 32.9422867698961];

const NavigationPage = ({ user }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [destFromPanel, setDestFromPanel] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [places, setPlaces] = useState([]);
  const [photoSpherePlace, setPhotoSpherePlace] = useState(null);

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

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, "places"));
      const placeList = [];
      querySnapshot.forEach((doc) => {
        placeList.push({ id: doc.id, ...doc.data() });
      });
      setPlaces(placeList);
    };
    fetchPlaces();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapContainerRef}
        style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
      />

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

      <div
        style={{ position: "absolute", top: "20px", left: "80px", zIndex: 30 }}
      >
        {user ? (
          <SearchBox
            mapRef={mapRef}
            user={user}
            onPlaceSelect={(place) => {
              setGalleryVisible(false);

              const matched = places.find(
                (p) =>
                  p.id === place.id ||
                  (p.name === place.name &&
                    Math.abs(p.lat - place.lat) < 0.0008 &&
                    Math.abs(p.lng - place.lng) < 0.0008)
              );

              const enrichedPlace = matched || place;
              setSelectedPlace(enrichedPlace);

              if (markerRef.current) markerRef.current.remove();

              const el = document.createElement("div");
              el.className = "mapbox-marker";
              el.style.cursor = enrichedPlace.photo360
                ? "pointer"
                : "not-allowed";
              el.style.width = "30px";
              el.style.height = "40px";
              el.style.backgroundImage =
                "url('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png')";
              el.style.backgroundSize = "100%";

              if (enrichedPlace.photo360) {
                el.addEventListener("click", () => {
                  setPhotoSpherePlace(enrichedPlace);
                });
              }

              const marker = new mapboxgl.Marker(el)
                .setLngLat([enrichedPlace.lng, enrichedPlace.lat])
                .addTo(mapRef.current);
              markerRef.current = marker;

              mapRef.current.flyTo({
                center: [enrichedPlace.lng, enrichedPlace.lat],
                zoom: 17,
              });

              // do NOT open photosphere immediately
              setPhotoSpherePlace(null);
            }}
          />
        ) : (
          <SignIn />
        )}
      </div>

      <div
        style={{ position: "absolute", top: "20px", left: "320px", zIndex: 30 }}
      >
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

      {selectedPlace && (
        <SidePanelPlaceInfo
          place={selectedPlace}
          user={user}
          mapRef={mapRef}
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

      {showDirectionsPanel && (
        <DirectionsPanel
          mapRef={mapRef}
          destination={destFromPanel}
          onClose={() => setShowDirectionsPanel(false)}
        />
      )}

      {galleryVisible && galleryImages.length > 0 && (
        <GalleryPanel
          photos={galleryImages}
          onClose={() => setGalleryVisible(false)}
        />
      )}

      {photoSpherePlace?.photo360 && (
        <PhotoSphere
          imageUrl={photoSpherePlace.photo360}
          onClose={() => setPhotoSpherePlace(null)}
        />
      )}
    </div>
  );
};

export default NavigationPage;
