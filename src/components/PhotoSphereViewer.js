import React from 'react';
import 'aframe';  // Import A-Frame library
import './PhotoSphereViewer.css';  // Optional: Custom styling for your scene

const PhotoSphere = ({ imageUrl, onClose }) => {
  return (
    <div className="photosphere-overlay">
      <button className="close-button" onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
        X
      </button>

      {/* A-Frame scene for 360° image */}
      <a-scene embedded style={{ height: '100vh', width: '100vw' }}>
        <a-sky src={imageUrl} rotation="0 -130 0"></a-sky>
        {/* Optional: Add camera for VR/3D interactivity */}
        <a-camera></a-camera>
      </a-scene>
    </div>
  );
};

export default PhotoSphere;
