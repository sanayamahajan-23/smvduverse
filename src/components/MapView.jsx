import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { getDistanceAndTime } from "../utils";

const MainGate = {
  name: "Main Gate",
  lat: 32.939258,
  lng: 74.951233,
};

const places = [
  { name: "Starting Point", lat: 32.941753700857866, lng: 74.95399572034623 },
];

const restrictedCoord = [32.940017, 74.952683];
const restrictedRadius = 25; // meters

const MapView = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const routeRef = useRef(null);

  const [start, setStart] = useState(places[0]);
  const [end, setEnd] = useState(MainGate);
  const [info, setInfo] = useState(null);

  // Helper: Get detour point at angle around restricted area
  const getDetourPoint = (from, to) => {
    const angleRad = Math.atan2(to.lat - from.lat, to.lng - from.lng);
    const offsetLat =
      restrictedCoord[0] + 0.0003 * Math.cos(angleRad + Math.PI / 2);
    const offsetLng =
      restrictedCoord[1] + 0.0003 * Math.sin(angleRad + Math.PI / 2);
    return [offsetLat, offsetLng];
  };

  const updateRoute = () => {
    if (!mapRef.current) return;

    try {
      if (routeRef.current) {
        mapRef.current.removeControl(routeRef.current);
        routeRef.current = null;
      }

      const detourPoint = getDetourPoint(start, end);

      routeRef.current = L.Routing.control({
        waypoints: [
          L.latLng([start.lat, start.lng]),
          L.latLng(detourPoint),
          L.latLng([end.lat, end.lng]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
      })
        .on("routesfound", (e) => {
          const routeCoords = e.routes[0].coordinates;
          const isNearRestricted = routeCoords.some(
            (pt) =>
              L.latLng(pt.lat, pt.lng).distanceTo(restrictedCoord) <
              restrictedRadius
          );

          if (isNearRestricted) {
            alert("Route still passes near restricted area!");
          }
        })
        .addTo(mapRef.current);

      const { distance, time } = getDistanceAndTime(
        [start.lat, start.lng],
        [end.lat, end.lng]
      );
      setInfo({ distance: distance.toFixed(2), time: time.toFixed(1) });
    } catch (err) {
      console.warn("Route update failed:", err);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapRef.current = L.map(mapContainerRef.current).setView(
      [start.lat, start.lng],
      17
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      mapRef.current
    );

    L.marker([start.lat, start.lng])
      .addTo(mapRef.current)
      .bindPopup(start.name);
    L.marker([end.lat, end.lng]).addTo(mapRef.current).bindPopup(end.name);

    // Draw restricted zone
    L.circle(restrictedCoord, {
      radius: restrictedRadius,
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
    })
      .addTo(mapRef.current)
      .bindPopup("Restricted Area");

    updateRoute();

    return () => {
      if (mapRef.current) {
        if (routeRef.current) {
          mapRef.current.removeControl(routeRef.current);
          routeRef.current = null;
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [start, end]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ height: "500px" }} />
      {info && (
        <div>
          <p>Distance: {info.distance} km</p>
          <p>Time: {info.time} minutes</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
