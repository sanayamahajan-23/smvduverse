import React, { useState } from "react";
import "./GalleryPanel.css";

const GalleryPanel = ({ photos, onClose }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  const openFullscreen = (index) => setFullscreenIndex(index);
  const closeFullscreen = () => setFullscreenIndex(null);

  const goNext = () => setFullscreenIndex((prev) => (prev + 1) % photos.length);
  const goPrev = () =>
    setFullscreenIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));

  return (
    <>
      {/* Right-side vertical gallery panel */}
      <div className="gallery-panel1">
        <button onClick={onClose} className="gallery-close-btn">
          ✕
        </button>
        <div className="gallery-vertical-list">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`photo-${index}`}
              className="gallery-thumb"
              onClick={() => openFullscreen(index)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen viewer */}
      {fullscreenIndex !== null && (
        <div className="fullscreen-overlay">
          <button className="fullscreen-close" onClick={closeFullscreen}>
            ✕
          </button>
          <button className="fullscreen-prev" onClick={goPrev}>
            ←
          </button>
          <img
            src={photos[fullscreenIndex]}
            alt={`fullscreen-${fullscreenIndex}`}
            className="fullscreen-image"
          />
          <button className="fullscreen-next" onClick={goNext}>
            →
          </button>
        </div>
      )}
    </>
  );
};

export default GalleryPanel;
