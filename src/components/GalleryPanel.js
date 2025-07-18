// components/GalleryPanel.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const GalleryPanel = ({ place, onClose }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!place?.lat || !place?.lng) return;

    const fetchImages = async () => {
      const q = query(
        collection(db, "places"),
        where("coordinates.lat", "==", place.lat),
        where("coordinates.lng", "==", place.lng)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setImages(data.gallery || []);
      } else {
        setImages([]);
      }
    };

    fetchImages();
  }, [place]);

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        right: 0,
        width: "200px",
        height: "100vh",
        backgroundColor: "white",
        borderLeft: "1px solid #ccc",
        overflowY: "scroll",
        zIndex: 40,
        padding: "10px",
      }}
    >
      <button onClick={onClose} style={{ float: "right" }}>
        ❌
      </button>
      <h4 style={{ marginTop: "2rem" }}>Gallery</h4>
      {images.length > 0 ? (
        images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`img-${idx}`}
            style={{
              width: "100%",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />
        ))
      ) : (
        <p>No gallery images.</p>
      )}
    </div>
  );
};

export default GalleryPanel;
