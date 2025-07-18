// components/DirectionsPanel.js
import React, { useEffect, useState, useRef } from "react";
import { FaTimes, FaSpinner, FaMicrophone } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import mapboxgl from "mapbox-gl";
import "./Searchbox.css";
import "./DirectionsPanel.css";
const DirectionsPanel = ({ mapRef, destination, onClose }) => {
  const [inputFrom, setInputFrom] = useState("");
  const [inputTo, setInputTo] = useState(destination || "");
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [details, setDetails] = useState(null);
  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const [liveCoords, setLiveCoords] = useState(null);

  const synthRef = useRef(window.speechSynthesis);
  const lastStepSpokenRef = useRef(null);

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
    const geo = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: false,
    });
    mapRef.current.addControl(geo);
    geo.on("geolocate", (pos) => {
      const { latitude, longitude } = pos.coords;
      setLiveCoords({ lat: latitude, lng: longitude });
    });
  }, [mapRef]);

  useEffect(() => {
    if (inputFrom && inputTo) getRoute();
  }, [inputFrom, inputTo]);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  };

  const getRoute = async () => {
    try {
      const coordsFrom = parseCoords(inputFrom);
      const coordsTo = parseCoords(inputTo);

      if (!coordsFrom || !coordsTo) return;

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsFrom.lng},${coordsFrom.lat};${coordsTo.lng},${coordsTo.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const data = await res.json();

      const steps = data.routes[0].legs[0].steps;
      setRoute(data.routes[0].geometry);
      setDetails({
        duration: data.routes[0].duration,
        distance: data.routes[0].distance,
        steps,
      });

      // Draw route
      const map = mapRef.current;
      if (map.getSource("route")) {
        map.getSource("route").setData(data.routes[0].geometry);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: data.routes[0].geometry,
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#3b9ddd",
            "line-width": 6,
          },
        });
      }

      // Speak next step automatically on location change
      if (steps.length > 0)
        lastStepSpokenRef.current = steps[0].maneuver.instruction;
      speak(`Route ready. ${steps[0].maneuver.instruction}`);
    } catch (err) {
      console.error("Route fetch error:", err);
    }
  };

  const parseCoords = (val) => {
    if (typeof val === "object") return val;
    const match = val.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[3]) };
    }
    const p = placesData.find((place) => place.name === val);
    if (p) return { lat: p.lat, lng: p.lng };
    return null;
  };

  const fetchSuggestions = async (val, setter) => {
    if (!val.trim()) return setter([]);
    const matched = placesData.filter((p) =>
      p.name?.toLowerCase().includes(val.toLowerCase())
    );
    if (matched.length > 0) return setter(matched);
    const coordMatch = val.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (coordMatch) {
      const [lat, lng] = [parseFloat(coordMatch[1]), parseFloat(coordMatch[3])];
      return setter([{ name: `Coordinates: ${lat}, ${lng}`, lat, lng }]);
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${val}&format=json`
      );
      const data = await res.json();
      setter(
        data.map((d) => ({
          name: d.display_name,
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon),
        }))
      );
    } catch (err) {
      console.error("Global place fetch error", err);
    }
  };

  return (
    <div className="directions-panel-container">
      <div className="directions-panel">
        <div className="directions-header">
          <h3>Get Directions</h3>
          <FaTimes onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

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
              if (liveCoords)
                setInputFrom(`${liveCoords.lat}, ${liveCoords.lng}`);
            }}
          >
            Use Live Location
          </button>
          {suggestionsFrom.length > 0 && (
            <ul className="suggestions-list">
              {suggestionsFrom.map((s, i) => (
                <li key={i} onClick={() => setInputFrom(s.name)}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>

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
                <li key={i} onClick={() => setInputTo(s.name)}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={getRoute}>Start Navigation</button>
      </div>

      {details && (
        <div className="directions-details-panel">
          <h4>Route Details</h4>
          <p>Duration: {(details.duration / 60).toFixed(1)} mins</p>
          <p>Distance: {(details.distance / 1000).toFixed(2)} km</p>
          <ul>
            {details.steps.map((s, idx) => (
              <li key={idx}>{s.maneuver.instruction}</li>
            ))}
          </ul>
          <button onClick={() => speak(details.steps[0].maneuver.instruction)}>
            <FaMicrophone /> Speak
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectionsPanel;
