import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const SignIn = () => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create user document
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        });

        // Create empty 'favorites' and 'recents' subcollections
        const favRef = doc(collection(db, "users", user.uid, "favorites"));
        await setDoc(favRef, {
          note: "example favorite",
          lat: 0,
          lng: 0,
          timestamp: serverTimestamp(),
        });

        const recentRef = doc(collection(db, "users", user.uid, "recents"));
        await setDoc(recentRef, {
          name: "example recent",
          lat: 0,
          lng: 0,
          timestamp: serverTimestamp(),
        });

        console.log("New user created with subcollections.");
      } else {
        console.log("Returning user.");
      }

      alert(`Signed in as ${user.email}`);
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert("Login failed.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={handleSignIn}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "6px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
