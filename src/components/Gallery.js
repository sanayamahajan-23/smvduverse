// Gallery.js
import React from 'react';
import './Gallery.css'; // Optional: Custom styling for the gallery

const Gallery = ({ images, onClose }) => {
  return (
    <div className="gallery-overlay">
      <button className="close-button" onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
        X
      </button>
      <div className="gallery-container">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Gallery Image ${index}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
