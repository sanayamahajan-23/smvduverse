import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async () => {
    const querySnap = await getDocs(collection(db, "places"));
    const data = [];
    querySnap.forEach((docSnap) => {
      data.push({ id: docSnap.id, ...docSnap.data() });
    });
    setPlaces(data.filter((p) => p.status === "pending"));
  };

  const approve = async (id) => {
    await updateDoc(doc(db, "places", id), { status: "approved" });
    fetchPlaces();
  };

  const reject = async (id) => {
    await updateDoc(doc(db, "places", id), { status: "rejected" });
    fetchPlaces();
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      {places.length === 0 && <p>No pending places.</p>}
      {places.map((p) => (
        <div key={p.id} className="place-card">
          <p><b>Latitude:</b> {p.latitude}</p>
          <p><b>Longitude:</b> {p.longitude}</p>
          <div className="buttons">
            <button className="approve-btn" onClick={() => approve(p.id)}>Approve</button>
            <button className="reject-btn" onClick={() => reject(p.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
