import React, { useState } from 'react';
import 'aframe';  // Import A-Frame library
import './PhotoSphereViewer.css';  // Optional: Custom styling for your scene

const PhotoSphere = ({ imageUrl, onClose }) => {
  // State to manage rotation of the sky
  const [rotation, setRotation] = useState({ x: 0, y: -130 , z: 0 });  // Initial rotation

  // Function to handle rotation changes
  const rotate = (direction) => {
    switch (direction) {
      case 'right':
        setRotation((prev) => ({ ...prev, y: prev.y + 10 })); // Rotate left
        break;
      case 'left':
        setRotation((prev) => ({ ...prev, y: prev.y - 10 })); // Rotate right
        break;
      case 'up':
        setRotation((prev) => ({ ...prev, z: prev.z +10 })); // Rotate up
        break;
      case 'down':
        setRotation((prev) => ({ ...prev, z: prev.z - 10 })); // Rotate down
        break;
      default:
        break;
    }
  };

  return (
    <div className="photosphere-overlay">
      <button className="close-button" onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
        X
      </button>

      {/* Navigation buttons */}
      <div className="navigation-buttons" style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 100 }}>
        <button onClick={() => rotate('right')}>→</button>
        <button onClick={() => rotate('up')}>↑</button>
        <button onClick={() => rotate('down')}>↓</button>
        <button onClick={() => rotate('left')}>←</button>
      </div>

      {/* A-Frame scene for 360° image */}
      <a-scene embedded style={{ height: '100vh', width: '100vw' }}>
        <a-sky src={imageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}></a-sky>
        {/* Optional: Add camera for VR/3D interactivity */}
        <a-camera></a-camera>
      </a-scene>
    </div>
  );
};

export default PhotoSphere;
