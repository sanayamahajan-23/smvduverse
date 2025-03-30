import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes, FaSpinner, FaHistory } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import "./SearchBox.css";

const SearchBox = ({ googleLoaded, onPlaceSelect, onCloseSidePanel, isSidePanelOpen }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!googleLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "in" },
        fields: ["place_id", "name", "geometry", "photos", "formatted_address"],
      });

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [googleLoaded]);

  useEffect(() => {
    const loadRecentSearchesFromFirestore = async () => {
      try {
        const q = query(collection(db, "recentSearches"), orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        const searches = querySnapshot.docs.map((doc) => doc.data());
        setRecentSearches(searches);
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearchesFromFirestore();
  }, []);

  const handlePlaceChanged = () => {
    setLoading(true);
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      console.error("Invalid place selected");
      setLoading(false);
      return;
    }

    const placeData = {
      placeName: place.name,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      imageUrl: place.photos?.[0]?.getUrl({ maxWidth: 800 }) || "https://via.placeholder.com/400",
      galleryImages: place.photos?.map(photo => photo.getUrl({ maxWidth: 800 })) || [],
      formattedAddress: place.formatted_address,
      placeId: place.place_id,
    };

    onPlaceSelect(placeData);
    setSearchValue(place.name);
    setLoading(false);
    saveRecentSearchToFirestore(placeData);
  };

  const saveRecentSearchToFirestore = async (place) => {
    if (!place || recentSearches.some((search) => search.placeId === place.placeId)) return;
    try {
      const docRef = await addDoc(collection(db, "recentSearches"), {
        name: place.placeName,
        placeId: place.placeId,
        timestamp: new Date(),
      });
      console.log("Search saved with ID:", docRef.id);
      setRecentSearches((prev) => [{ name: place.placeName, placeId: place.placeId }, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Failed to save search:", error.message);
    }
  };

  const fetchPlaceDetails = (placeId) => {
    if (!googleLoaded || !window.google || !window.google.maps || !window.google.maps.places) return;
    console.log("Fetching details for placeId:", placeId);

    
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId, fields: ["place_id", "name", "geometry", "photos", "formatted_address"] }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
        handlePlaceChangedFromRecent(place);
      }
    });
  };

  const handlePlaceChangedFromRecent = (place) => {
    const placeData = {
      placeName: place.name,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      imageUrl: place.photos?.[0]?.getUrl({ maxWidth: 800 }) || "https://via.placeholder.com/400",
      galleryImages: place.photos?.map(photo => photo.getUrl({ maxWidth: 800 })) || [],
      formattedAddress: place.formatted_address,
      placeId: place.place_id,
    };

    onPlaceSelect(placeData);
    setSearchValue(place.name);
  };

  const handleInputChange = (e) => {
  setSearchValue(e.target.value);
  setShowRecent(e.target.value.trim() === ""); // Hide recent searches when typing
};


const handleSearchClick = () => {
  if (!googleLoaded || !autocompleteRef.current) return;

  const place = autocompleteRef.current.getPlace();
  
  if (place && place.geometry) {
    handlePlaceChanged();
  } else if (searchValue.trim() !== "") {
    // Fetch place details based on input value
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.findPlaceFromQuery(
      {
        query: searchValue,
        fields: ["place_id", "name", "geometry", "photos", "formatted_address"],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
          handlePlaceChangedFromRecent(results[0]);
        } else {
          console.error("Place not found:", status);
        }
      }
    );
  }
};


  const handleClear = () => {
    setSearchValue("");
    onCloseSidePanel();
  };

  return (
    <div className="search-box-container" style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a place..."
        className="search-box"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        onFocus={() => setShowRecent(true)}
        onBlur={() => setTimeout(() => setShowRecent(false), 200)}
        autoFocus
      /> 
      
      <button className="search-btn" onClick={handleSearchClick}>
        <FaSearch size={18} />
      </button>
      {isSidePanelOpen ? (
        <button className="clear-btn" onClick={handleClear}>
          <FaTimes size={20} />
        </button>
      ) : loading ? (
        <FaSpinner className="loading-icon" size={20} />
      ) : null}

      {showRecent && recentSearches.length > 0 && (
        <ul className="recent-dropdown">
          {recentSearches.map((search, index) => (
            <li
              key={index}
              onMouseDown={() => {
                setSearchValue(search.name);
                fetchPlaceDetails(search.placeId);
                setShowRecent(false);
              }}
            >
              <FaHistory size={16} style={{ marginRight: "8px", color: "#555" }} />
              {search.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
