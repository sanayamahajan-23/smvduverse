import React, { useState, useEffect } from 'react';
import 'aframe';  // Import A-Frame library
import './PhotoSphereViewer.css';  // Optional: Custom styling for your scene
import Gallery from './Gallery'; 

const PhotoSphere = ({ imageUrl, additionalImages, onClose }) => {
  const [rotation, setRotation] = useState({ x: 0, y: -130, z: 0 }); // Initial rotation
  const [cameraZ, setCameraZ] = useState(-5); // Initial camera position along z-axis
  const [showGallery, setShowGallery] = useState(false); // State to show/hide the gallery
  const [panelVisible, setPanelVisible] = useState(true); // State for showing/hiding control panel
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode

  const rotate = (direction) => {
    switch (direction) {
      case 'right':
        setRotation((prev) => ({ ...prev, y: prev.y + 10 })); 
        break;
      case 'left':
        setRotation((prev) => ({ ...prev, y: prev.y - 10 })); 
        break;
      case 'up':
        setRotation((prev) => ({ ...prev, z: prev.z + 10 })); 
        break;
      case 'down':
        setRotation((prev) => ({ ...prev, z: prev.z - 10 })); 
        break;
      default:
        break;
    }
  };

  const handleZoomOut = () => {
    setCameraZ((prevZ) => Math.min(prevZ + 10, 80)); 
  };

  const handleZoomIn = () => {
    setCameraZ((prevZ) => Math.max(prevZ - 10, -50)); 
  };

  const handleRefresh = () => {
    setCameraZ(-5); 
    setRotation({ x: 0, y: -130, z: 0 }); 
  };

  const togglePanelVisibility = () => {
    setPanelVisible((prevVisible) => !prevVisible);
  };

  // Toggle fullscreen mode
  const enterFullscreen = () => {
    document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  };

  // Exit fullscreen mode
  const exitFullscreen = () => {
    document.exitFullscreen();
    setIsFullscreen(false);
  };

  // Check if the user exits fullscreen using the escape key or system methods
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="photosphere-overlay">
      <button className="close-button" onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
        X
      </button>

      {panelVisible && (
        <div className="control-panel" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '10px 50px 10px 50px',
          borderRadius: '8px'
        }}>
          <button onClick={() => rotate('left')}>←</button>
          <button onClick={() => rotate('up')}>↑</button>
          <button onClick={() => rotate('down')}>↓</button>
          <button onClick={() => rotate('right')}>→</button>

          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          <button onClick={handleRefresh}>Refresh</button>
          <button onClick={() => setShowGallery(true)}>Open Gallery</button>
          {!isFullscreen && (
            <button onClick={enterFullscreen}>Fullscreen</button>
          )}
        </div>
      )}

      {/* Toggle Button for the Panel */}
      <button
        onClick={togglePanelVisibility}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '50%',
          padding: '5px 10px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        {panelVisible ? '∨' : '∧'}
      </button>

      {/* Minimize Button for Fullscreen */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '50%',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          –
        </button>
      )}

      {/* Minimize Button for Fullscreen */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '50%',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          –
        </button>
      )}

      <a-scene embedded style={{ height: '100vh', width: '100vw' }}>
        <a-sky src={imageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}></a-sky>
        <a-camera position={`0 0 ${cameraZ}`}></a-camera>
      </a-scene>

      {showGallery && (
        <Gallery images={additionalImages} onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
};

export default PhotoSphere;
