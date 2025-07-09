import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set token globally
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtY3VxOXRtMDAyczUybXF4NzZ6ZnRqZTcifQ.jQjKT4via_3h8_Hyw27GGw";

const NavigationPage = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [74.95406843692183, 32.94213370448009], // SMVDU coordinates
      zoom: 17, // Closer zoom
      pitch: 0, // Top-down view (0° tilt)
      bearing: 0, // No rotation
      antialias: true, // Smooth edges
    });

    map.on("load", () => {
      // Add custom markers for important buildings
      const buildings = [
        {
          name: "Shri Mata Vaishno Devi University",
          coordinates: [74.954, 32.9421],
        },
        { name: "Hostel Block", coordinates: [74.9535, 32.942] },
        { name: "Main Building", coordinates: [74.9545, 32.9423] },
        { name: "Library", coordinates: [74.9542, 32.9418] },
      ];

      buildings.forEach((building) => {
        // Create marker element
        const el = document.createElement("div");
        el.className = "campus-marker";
        el.innerHTML = `<span>${building.name}</span>`;

        // Add marker to map
        new mapboxgl.Marker(el).setLngLat(building.coordinates).addTo(map);
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      // Add scale control
      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        }),
        "bottom-left"
      );
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default NavigationPage;
