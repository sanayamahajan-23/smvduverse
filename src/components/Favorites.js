import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Favorites = ({ onSearchLocation }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Input fields for modal
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchFavorites(currentUser.uid);
      } else {
        setUser(null);
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (uid) => {
    try {
      const favCollection = collection(db, "users", uid, "favorites");
      const favSnapshot = await getDocs(favCollection);
      const favList = favSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(favList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    try {
      if (!user) return;

      const favRef = collection(db, "users", user.uid, "favorites");
      await addDoc(favRef, {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
        note,
        timestamp: new Date(),
      });

      setLat("");
      setLng("");
      setName("");
      setNote("");
      setShowModal(false);
      fetchFavorites(user.uid);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleDeleteFavorite = async (favId) => {
    try {
      if (!user) return;

      const docRef = doc(db, "users", user.uid, "favorites", favId);
      await deleteDoc(docRef);
      fetchFavorites(user.uid);
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const handleSearch = (lat, lng) => {
    if (onSearchLocation) {
      onSearchLocation(lat, lng);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p style={{ marginTop: "6rem" }}>Please <strong>sign in</strong> to view your favorite places.</p>;
  }

  return (
    <div style={{ padding: "3rem" }}>
      <h2 className="text-l font-semibold mb-4">Your Favorite Places</h2>

      <button onClick={() => setShowModal(true)} style={{ marginBottom: "0.5rem" }}>
        ➕ Add Favorite
      </button>

      {showModal && (
        <div style={{ backgroundColor: "#000000aa", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div style={{ background: "#fff", margin: "10% auto", padding: "20px", width: "300px", borderRadius: "8px" }}>
            <h3>Add New Favorite</h3>
            <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} /><br />
            <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} /><br />
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} /><br />
            <button onClick={handleAddFavorite}>✅ Add</button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>❌ Cancel</button>
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <p>No favorites yet. Add some!</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id} style={{ marginBottom: "1rem" }}>
              <strong
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleSearch(fav.lat, fav.lng)}
              >
                📍 {fav.name || "Unnamed Location"}
              </strong><br />
              Note: {fav.note} <br />
              Lat: {fav.lat}, Lng: {fav.lng} <br />
              <button onClick={() => handleDeleteFavorite(fav.id)} style={{ color: "red" }}>
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
