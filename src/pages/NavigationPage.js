import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import SidePanel from "../components/sidebar";
import SearchBox from "../components/Searchbox";
import SignIn from "../components/signin";
import SidePanelPlaceInfo from "../components/SidePanelPlaceInfo";
import GalleryPanel from "../components/GalleryPanel";
import DirectionsPanel from "../components/DirectionsPanel";
import PhotoSphere from "../components/PhotoSphereBasic";
import { FaDirections, FaArrowLeft } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const smvduCoords = [32.9422867698961, 74.95410062342953];

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const NavigationPage = ({ user }) => {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState(null);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [destFromPanel, setDestFromPanel] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [places, setPlaces] = useState([]);
  const [photoSpherePlace, setPhotoSpherePlace] = useState(null);
  const [searchedMarker, setSearchedMarker] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, "places"));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPlaces(list);
    };
    fetchPlaces();
  }, []);

  const PlaceMarkers = () => {
    const map = useMap();
    useEffect(() => {
      setMapInstance(map);
    }, [map]);

    return (
      <>
        {places
          .filter((p) => p.status === "approved")
          .map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setGalleryVisible(false);
                  setSelectedPlace(place);
                  if (place.photo360) {
                    setPhotoSpherePlace(place);
                  }
                },
              }}
            />
          ))}
      </>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MapContainer
        center={smvduCoords}
        zoom={17}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PlaceMarkers />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: 1000,
        }}
      >
        <SidePanel
          user={user}
          onSearchLocation={(place) => {
            document.querySelector(".searchbox-input input").value = place.name;
            const inputEvent = new Event("input", { bubbles: true });
            document
              .querySelector(".searchbox-input input")
              .dispatchEvent(inputEvent);
          }}
        />
      </div>

      <div
        style={{ position: "absolute", top: "20px", left: "80px", zIndex: 500 }}
      >
        {user ? (
          <SearchBox
            mapRef={{ current: mapInstance }}
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
              mapInstance.setView([enrichedPlace.lat, enrichedPlace.lng], 18);
              setPhotoSpherePlace(null);

              if (searchedMarker) {
                mapInstance.removeLayer(searchedMarker);
              }

              const marker = L.marker([enrichedPlace.lat, enrichedPlace.lng], {
                icon: customIcon,
              });

              marker.on("click", () => {
                if (enrichedPlace.photo360) {
                  setPhotoSpherePlace(enrichedPlace);
                }
              });

              marker.addTo(mapInstance);
              setSearchedMarker(marker);
            }}
          />
        ) : (
          <SignIn />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: "35px",
          left: "450px",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <button
          style={{
            backgroundColor: "#fff",
            padding: "15px 12px",
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
          <FaDirections size={20} />
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "50px",
          zIndex: 1000,
        }}
      >
        <button
          style={{
            backgroundColor: "#fff",
            padding: "10px 14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
          onClick={() => navigate("/smvdu-map")}
        >
          <FaArrowLeft size={16} style={{ marginRight: "6px" }} />
        </button>
      </div>

      {selectedPlace && (
        <SidePanelPlaceInfo
          place={selectedPlace}
          user={user}
          mapRef={{ current: mapInstance }}
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
          mapRef={{ current: mapInstance }}
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
