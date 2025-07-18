// components/SearchBox.js
import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaArrowRight, FaSpinner } from "react-icons/fa";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "./Searchbox.css";

const SearchBox = ({ mapRef, user, onPlaceSelect }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placesData, setPlacesData] = useState([]);
  const [recents, setRecents] = useState([]);
  const [selected, setSelected] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const snapshot = await getDocs(collection(db, "places"));
        const places = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            lat: typeof data.lat === "string" ? parseFloat(data.lat) : data.lat,
            lng: typeof data.lng === "string" ? parseFloat(data.lng) : data.lng,
          };
        });
        console.log("Fetched places:", places);
        setPlacesData(places);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    const fetchRecents = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "recents"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const recentList = snapshot.docs.map((doc) => doc.data());
        setRecents(recentList);
      } catch (err) {
        console.error("Error fetching recents:", err);
      }
    };

    fetchPlaces();
    fetchRecents();
  }, [user]);

  const updateRecents = async (place) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "recents"), {
        ...place,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating recents:", err);
    }
  };

  const handleInputFocus = () => {
    if (input.trim() === "") {
      setSuggestions(recents);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (val.trim() === "") {
        setSuggestions(recents);
        return;
      }

      const matched = placesData.filter((p) =>
        p.name?.toLowerCase().includes(val.toLowerCase().trim())
      );

      if (matched.length > 0) {
        setSuggestions(matched);
      } else if (/^-?\d+(\.\d+)?[\s,]+-?\d+(\.\d+)?$/.test(val)) {
        const [lat, lng] = val.split(/[\s,]+/).map(Number);
        const nearbyMatch = placesData.find((place) => {
          const distLat = Math.abs(place.lat - lat);
          const distLng = Math.abs(place.lng - lng);
          return distLat < 0.0008 && distLng < 0.0008; // ~80m tolerance
        });

        if (nearbyMatch) {
          setSuggestions([nearbyMatch]);
        } else {
          setSuggestions([
            {
              name: `Coordinates: ${lat}, ${lng}`,
              lat,
              lng,
              isCoords: true,
            },
          ]);
        }
      } else {
        fetchGlobalPlaces(val);
      }
    }, 300);
  };

  const fetchGlobalPlaces = async (queryStr) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${queryStr}&format=json`
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

    if (coords?.lat && coords?.lng) {
      mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 17 });

      if (!selected.isCoords) updateRecents(selected);

      const placeMatch = placesData.find((place) => {
        const distLat = Math.abs(place.lat - coords.lat);
        const distLng = Math.abs(place.lng - coords.lng);
        return distLat < 0.0008 && distLng < 0.0008;
      });

      if (selected.isCoords && placeMatch) {
        onPlaceSelect?.(placeMatch);
      } else {
        onPlaceSelect?.(selected);
      }
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
          onFocus={handleInputFocus}
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
