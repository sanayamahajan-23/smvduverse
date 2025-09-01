import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Signup.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signed up successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
    });
  };

  const submitLocation = async () => {
    if (!user) return alert("You must sign in first!");
    try {
      await addDoc(collection(db, "places"), {
        userId: user.uid,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        status: "pending",
        timestamp: serverTimestamp(),
      });
      alert("Location submitted for approval!");
      setLat("");
      setLng("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>

      <h3>Submit Location</h3>
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <button onClick={useCurrentLocation}>Use My Location</button>
      <button onClick={submitLocation}>Submit</button>
    </div>
  );
}
