import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaArrowRight, FaSpinner } from "react-icons/fa";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Searchbox.css";

const SearchBox = ({ mapRef, user }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placesData, setPlacesData] = useState([]);
  const [recents, setRecents] = useState([]);
  const [selected, setSelected] = useState(null);
  const timeoutRef = useRef(null);

  // Fetch places & user-specific recents
  useEffect(() => {
    const fetchPlaces = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      const places = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlacesData(places);
    };

    const fetchRecents = async () => {
      if (!user) return;
      const q = query(
        collection(db, "users", user.uid, "recents"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const recentList = snapshot.docs.map((doc) => doc.data());
      setRecents(recentList);
    };

    fetchPlaces();
    fetchRecents();
  }, [user]);

  const updateRecents = async (place) => {
    if (!user) return;
    const newEntry = { ...place, timestamp: Date.now() };
    await addDoc(collection(db, "users", user.uid, "recents"), newEntry);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val.trim() === "") {
      setSuggestions(recents);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const matched = placesData.filter((p) =>
        p.name.toLowerCase().includes(val.toLowerCase())
      );

      if (matched.length > 0) {
        setSuggestions(matched);
      } else if (/^-?\d+(\.\d+)?[,\s]+-?\d+(\.\d+)?$/.test(val)) {
        // coordinate input
        const [lat, lng] = val.split(/[\s,]+/).map(Number);
        setSuggestions([
          { name: `Coordinates: ${lat}, ${lng}`, lat, lng, isCoords: true },
        ]);
      } else {
        fetchGlobalPlaces(val);
      }
    }, 300);
  };

  const fetchGlobalPlaces = async (query) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
      );
      const data = await res.json();
      setSuggestions(
        data.map((item) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          isGlobal: true,
        }))
      );
    } catch (err) {
      console.error("Global search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    setInput(place.name);
    setSuggestions([]);
    setSelected(place);
  };

  const panToPlace = () => {
    if (!selected || !mapRef?.current) return;
    setLoading(true);

    const coords = selected.coordinates || {
      lat: selected.lat,
      lng: selected.lng,
    };

    if (coords) {
      mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 18 });
      updateRecents(selected);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") panToPlace();
  };

  return (
    <div className="searchbox-container">
      <div className="searchbox-input">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by place or coordinates..."
        />
        {loading ? (
          <FaSpinner className="spinner spin" />
        ) : (
          <FaArrowRight className="go-icon" onClick={panToPlace} />
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((place, index) => (
            <li key={index} onClick={() => handleSelect(place)}>
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
