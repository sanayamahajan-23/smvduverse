import React, { useState } from 'react';
import 'aframe';  // Import A-Frame library
import './PhotoSphereViewer.css';  // Optional: Custom styling for your scene

const PhotoSphere = ({ imageUrl, onClose }) => {
  // State to manage rotation of the sky
  const [rotation, setRotation] = useState({ x: 0, y: -130, z: 0 }); // Initial rotation
  const [cameraZ, setCameraZ] = useState(-5); // Initial camera position along z-axis
  
  // Function to handle rotation changes
  const rotate = (direction) => {
    switch (direction) {
      case 'right':
        setRotation((prev) => ({ ...prev, y: prev.y + 10 })); // Rotate right
        break;
      case 'left':
        setRotation((prev) => ({ ...prev, y: prev.y - 10 })); // Rotate left
        break;
      case 'up':
        setRotation((prev) => ({ ...prev, z: prev.z + 10 })); // Rotate up
        break;
      case 'down':
        setRotation((prev) => ({ ...prev, z: prev.z - 10 })); // Rotate down
        break;
      default:
        break;
    }
  };

  const handleZoomOut = () => {
    setCameraZ((prevZ) => Math.min(prevZ + 10, 80)); // Zoom in by moving the camera closer
  };

  const handleZoomIn = () => {
    setCameraZ((prevZ) => Math.max(prevZ - 10, -50)); // Zoom out by moving the camera away
  };

  const handleRefresh = () => {
    setCameraZ(-5); // Reset camera position to initial
    setRotation({ x: 0, y: -130, z: 0 }); // Reset rotation to initial
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

      {/* Zoom and Refresh buttons */}
      <div className="zoom-buttons" style={{ position: 'absolute', bottom: '20px', left: '10px', zIndex: 100 }}>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleRefresh}>Refresh</button>
      </div>

      {/* A-Frame scene for 360° image */}
      <a-scene embedded style={{ height: '100vh', width: '100vw' }}>
        <a-sky src={imageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}></a-sky>
        {/* Camera position is adjusted for zoom effect */}
        <a-camera position={`0 0 ${cameraZ}`}></a-camera>
      </a-scene>
    </div>
  );
};

export default PhotoSphere;
