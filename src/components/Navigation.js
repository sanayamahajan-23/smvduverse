// NavigationPage.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./sidebar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Navigation.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtY3VxOXRtMDAyczUybXF4NzZ6ZnRqZTcifQ.jQjKT4via_3h8_Hyw27GGw";

const NavigationPage = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [places, setPlaces] = useState([]);

  // Fetch places from Firestore
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "places"));
        const fetchedPlaces = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("📍Fetched place:", data);
          return data;
        });
        setPlaces(fetchedPlaces);
      } catch (error) {
        console.error("Error fetching places from Firestore:", error);
      }
    };

    fetchPlaces();
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [74.954068, 32.942134],
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    return () => map.remove();
  }, []);

  // Add markers to map after data loads
  useEffect(() => {
    if (!mapRef.current || places.length === 0) return;

    places.forEach((place) => {
      const { lng, lat, name } = place;

      if (
        typeof lng === "number" &&
        typeof lat === "number"
      ) {
        const el = document.createElement("div");
        el.className = "campus-marker";
        el.innerHTML = `<span>${name}</span>`;

        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      } else {
        console.warn("⚠️ Invalid coordinates for:", place);
      }
    });
  }, [places]);

  return (
    <div className="navigation-container">
      <Sidebar />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default NavigationPage;
