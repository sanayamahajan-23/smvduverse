import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./sidebar"; 
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuYXlhMTIzIiwiYSI6ImNtY3VxOXRtMDAyczUybXF4NzZ6ZnRqZTcifQ.jQjKT4via_3h8_Hyw27GGw";

const NavigationPage = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [74.95406843692183, 32.94213370448009],
      zoom: 17,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.on("load", () => {
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
        const el = document.createElement("div");
        el.className = "campus-marker";
        el.innerHTML = `<span>${building.name}</span>`;
        new mapboxgl.Marker(el).setLngLat(building.coordinates).addTo(map);
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
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
    style={{
      display: "flex",
      flexDirection: "row",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}
  >
    {/* Sidebar container */}
    <div>
      <Sidebar />
    </div>

    {/* Map container */}
    <div
      ref={mapContainer}
      style={{
        flex: 1,
        position: "relative",
        zIndex: 1,
      }}
    />
  </div>
);
}

export default NavigationPage;
