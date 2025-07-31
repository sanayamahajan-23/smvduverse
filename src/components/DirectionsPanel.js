// DirectionsPanel.js
import React, { useEffect, useState, useRef } from "react";
import {
  FaTimes,
  FaMicrophone,
  FaListUl,
  FaWalking,
  FaBicycle,
  FaCar,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import L from "leaflet";
import "leaflet-routing-machine";
import "./DirectionsPanel.css";

const DirectionsPanel = ({ mapRef, destination, onClose }) => {
  const [inputFrom, setInputFrom] = useState("");
  const [inputTo, setInputTo] = useState(destination || "");
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [liveCoords, setLiveCoords] = useState(null);
  const [showStepsPanel, setShowStepsPanel] = useState(false);
  const routingControlRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const synthRef = useRef(window.speechSynthesis);
  const spokenStepIndex = useRef(0);
  const [mode, setMode] = useState("foot");
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [eta, setEta] = useState(null);
  const [speaking, setSpeaking] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      const places = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lat: parseFloat(doc.data().lat),
        lng: parseFloat(doc.data().lng),
      }));
      setPlacesData(places);
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLiveCoords({ lat: latitude, lng: longitude });
        checkStepProximity(latitude, longitude);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [steps]);

  const checkStepProximity = (lat, lng) => {
    if (!steps.length || !speaking) return;
    const step = steps[spokenStepIndex.current];
    if (!step) return;
    const dx = step.lat - lat;
    const dy = step.lng - lng;
    const distance = Math.sqrt(dx * dx + dy * dy);
  };

 
  const parseCoords = (val) => {
    if (typeof val === "object") return val;
    const coordMatch = val.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (coordMatch) {
      return {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[3]),
      };
    }
    const place = placesData.find((p) => p.name === val);
    return place ? { lat: place.lat, lng: place.lng } : null;
  };

  const fetchSuggestions = (val, setter) => {
    if (!val.trim()) return setter([]);
    const matches = placesData.filter((p) =>
      p.name?.toLowerCase().includes(val.toLowerCase())
    );
    setter(matches);
  };

  const buildRoute = () => {
    const from = parseCoords(inputFrom);
    const to = parseCoords(inputTo);
    if (!from || !to || !mapRef.current) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
      router: L.Routing.osrmv1({ profile: mode }),
      createMarker: () => null,
      show: false,
      addWaypoints: false,
    })
      .on("routesfound", (e) => {
        const newSteps = [];
        const route = e.routes[0];
        setDistance((route.summary.totalDistance / 1000).toFixed(2));
        setTime((route.summary.totalTime / 60).toFixed(1));
        const arrival = new Date(Date.now() + route.summary.totalTime * 1000);
        setEta(
          arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );

        route.instructions.forEach((instr) => {
          if (instr.latLng) {
            newSteps.push({
              instruction: instr.text,
              lat: instr.latLng.lat,
              lng: instr.latLng.lng,
            });
          }
        });
        setSteps(newSteps);
        spokenStepIndex.current = 0;
      })
      .addTo(mapRef.current);

    const container = document.querySelector(
      ".leaflet-routing-container.leaflet-control"
    );
    if (container) container.style.display = "none";

    routingControlRef.current = control;
  };

  return (
    <div className="directions-panel-container">
      <div className="directions-panel">
        <div className="directions-header">
          <h3>Get Directions</h3>
          <FaTimes onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        {/* From Input */}
        <div className="input-group">
          <input
            type="text"
            placeholder="From..."
            value={inputFrom}
            onChange={(e) => {
              setInputFrom(e.target.value);
              fetchSuggestions(e.target.value, setSuggestionsFrom);
            }}
          />
          <button
            onClick={() => {
              if (liveCoords) {
                setInputFrom(
                  `${liveCoords.lat.toFixed(6)}, ${liveCoords.lng.toFixed(6)}`
                );
                setSuggestionsFrom([]);
              }
            }}
          >
            Use Live Location
          </button>
          {suggestionsFrom.length > 0 && (
            <ul className="suggestions-list">
              {suggestionsFrom.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setInputFrom(s.name);
                    setSuggestionsFrom([]);
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* To Input */}
        <div className="input-group">
          <input
            type="text"
            placeholder="To..."
            value={inputTo}
            onChange={(e) => {
              setInputTo(e.target.value);
              fetchSuggestions(e.target.value, setSuggestionsTo);
            }}
          />
          {suggestionsTo.length > 0 && (
            <ul className="suggestions-list">
              {suggestionsTo.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setInputTo(s.name);
                    setSuggestionsTo([]);
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Mode buttons */}
        <div className="mode-buttons">
          {["foot", "bike", "car"].map((m) => (
            <button
              key={m}
              className={mode === m ? "active" : ""}
              onClick={() => {
                setMode(m);
                buildRoute();
              }}
            >
              {m === "foot" ? (
                <FaWalking />
              ) : m === "bike" ? (
                <FaBicycle />
              ) : (
                <FaCar />
              )}
            </button>
          ))}
        </div>
        {/* Time / Distance / ETA */}
        {distance && time && (
          <div className="summary">
            <strong>{distance} km</strong> | <strong>{time} min</strong> | ETA:{" "}
            {eta}
          </div>
        )}

        <div className="direction-buttons">
          <button onClick={buildRoute}>Start Navigation</button>
          
         
        </div>
      </div>
    </div>
  );
};

export default DirectionsPanel;
