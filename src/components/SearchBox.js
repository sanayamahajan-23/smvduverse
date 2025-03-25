import React, { useEffect } from "react";
import "./SearchBox.css";

const SearchBox = ({ onPlaceSelect }) => {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const input = document.getElementById("searchBox");
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
    });

    autocomplete.addListener("place_changed", async () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      const placeId = place.place_id; // Get place ID

      try {
        // Fetch the place details to get a photo_reference
        const detailsResponse = await fetch(
          `https://maps.gomaps.pro/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`
        );
        const detailsData = await detailsResponse.json();

        let mainImage = null;
        if (detailsData.result.photos && detailsData.result.photos.length > 0) {
          const photoReference = detailsData.result.photos[0].photo_reference;
          mainImage = `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=400&key=${apiKey}`;
        }

        onPlaceSelect({
          name: place.name,
          lat: location.lat(),
          lng: location.lng(),
          imageUrl: mainImage, // GoMaps only provides one image
          galleryImages: [], // No gallery images available from GoMaps
        });
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    });
  }, [onPlaceSelect]);

  return (
    <input
      id="searchBox"
      type="text"
      placeholder="Search for a place..."
      className="search-box"
      autoComplete="on"
    />
  );
};

export default SearchBox;
