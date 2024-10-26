import React, { useState, useEffect } from 'react';
import 'aframe';  // Import A-Frame library
import './PhotoSphereViewer.css';  // Optional: Custom styling for your scene
import Gallery from './Gallery'; 

const PhotoSphere = ({imageUrl: initialImageUrl, additionalImages: initialAdditionalImages,hotspots,currentHotspotIndex,setCurrentHotspotIndex ,onClose }) => {
  const [rotation, setRotation] = useState({ x: 0, y: -130, z: 0 }); // Initial rotation
  const [cameraZ, setCameraZ] = useState(-5); // Initial camera position along z-axis
  const [showGallery, setShowGallery] = useState(false); // State to show/hide the gallery
  const [panelVisible, setPanelVisible] = useState(true); // State for showing/hiding control panel
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode
  const [showHotspotMenu, setShowHotspotMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);  // Initialize imageUrl from props
  const [additionalImages, setAdditionalImages] = useState(initialAdditionalImages);
  const [isStereoVRMode, setIsStereoVRMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateDelay, setAutoRotateDelay] = useState(3000);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  useEffect(() => {
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setLastMousePosition({ x: event.clientX, y: event.clientY });
    };
    const handleMouseMove = (event) => {
      if (isStereoVRMode && isDragging && lastMousePosition) {
        const deltaX = event.clientX - lastMousePosition.x;
        const deltaY = event.clientY - lastMousePosition.y;
    
        setRotation((prev) => ({
          x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.1)), // Prevent vertical limits
          y: (prev.y + deltaX * 0.1) % 360, // Wrap around 360 degrees
          z: prev.z,
        }));
    
        // Update last mouse position
        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setLastMousePosition(null); // Reset last position on mouse up
    };
    if (isStereoVRMode) {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isStereoVRMode, isDragging, lastMousePosition]);
  useEffect(() => {
    // Start auto-rotation after a delay
    const delayTimeout = setTimeout(() => {
      setAutoRotate(true);
    }, autoRotateDelay);
    return () => clearTimeout(delayTimeout); // Cleanup on unmount
  }, [autoRotateDelay]);
  useEffect(() => {
    let interval;
    if (autoRotate && !isStereoVRMode) {
      interval = setInterval(() => {
        setRotation((prev) => ({ ...prev, y: prev.y + 0.01 })); // Adjust rotation speed as needed
      }, 100); // Adjust interval time for smoother rotation
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRotate, isStereoVRMode]);
  useEffect(() => {
    if (hotspots.length > 0 && currentHotspotIndex >= 0 && currentHotspotIndex < hotspots.length) {
      const newImageUrl = hotspots[currentHotspotIndex].imageUrl;
      console.log("Setting image URL:", newImageUrl);
      setImageUrl(newImageUrl);
      setAdditionalImages(hotspots[currentHotspotIndex].galleryImages);
      setAutoRotate(false);
    }
  }, [currentHotspotIndex, hotspots]);

  const rotate = (direction) => {
    setAutoRotate(false);
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
  const toggleHotspotMenu = () => {
    setShowHotspotMenu((prevVisible) => !prevVisible);
  };
  const handleHotspotClick = (hotspot) => {
    console.log("Selected Hotspot Image URL:", hotspot.imageUrl);
    setShowHotspotMenu(false); // Close the hotspot menu after selecting a hotspot
    setCameraZ(-5); // Reset zoom to default
    setRotation({ x: 0, y: -130, z: 0 }); // Reset rotation to default
    setImageUrl(hotspot.imageUrl); // Set new hotspot image
    setAdditionalImages(hotspot.galleryImages); // Set new gallery images
    const index = hotspots.findIndex((h) => h === hotspot);
    if (index !== -1) {
      setCurrentHotspotIndex(index);
    }
  };
  const goToPreviousHotspot = () => {
    setCurrentHotspotIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : hotspots.length - 1)); // Loop to last if at the first
  };

  // Function to navigate to the next hotspot
  const goToNextHotspot = () => {
    setCurrentHotspotIndex((prevIndex) => (prevIndex < hotspots.length - 1 ? prevIndex + 1 : 0)); // Loop to first if at the last
  };
   const toggleStereoVRMode = () => {
    setIsStereoVRMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        // Disable auto-rotation when entering VR mode
        setAutoRotate(false);
      }
      return newMode;
    });
  };
  return (
    <div className="photosphere-overlay">
         {!isStereoVRMode && (<button className="close-button" onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>

        X
        </button>)}

        {!isStereoVRMode && panelVisible && (
        <div className="control-panel" style={{
          position: 'absolute',
          bottom: '45px',
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
          <button onClick={goToPreviousHotspot}>prev</button> {/* Previous Hotspot Button */}
          <button onClick={() => rotate('left')}>←</button>
          <button onClick={() => rotate('up')}>↑</button>
          <button onClick={() => rotate('down')}>↓</button>
          <button onClick={() => rotate('right')}>→</button>
     
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          <button onClick={handleRefresh}>Refresh</button>
          <button onClick={toggleHotspotMenu}>Menu</button>
          <button onClick={toggleStereoVRMode}>Enter VR</button>
          <button onClick={() => setShowGallery(true)}>Open Gallery</button>
          {!isFullscreen && (
            <button onClick={enterFullscreen}>Fullscreen</button>
          )}
          <button onClick={goToNextHotspot}>next</button> {/* Next Hotspot Button */}
        </div>
      )}
      {isStereoVRMode && (
        <button
          onClick={toggleStereoVRMode}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >   Exit VR
        </button>
      )}

{showHotspotMenu && (
  <div
    className="hotspot-menu"
    style={{
      position: 'absolute',
      top: '50px',
      right: '10px',
      zIndex: 200,
      width: '250px',
      maxHeight: '70vh',
      overflowY: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '10px',
      borderRadius: '8px',
    }}
  >
    {hotspots.map((hotspot, index) => (
      <div
        key={index}
        onClick={() => handleHotspotClick(hotspot)}
        style={{
          position: 'relative',
          marginBottom: '10px',
          cursor: 'pointer',
          border: currentHotspotIndex === index ? '2px solid white' : '1px solid black',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: currentHotspotIndex === index ? '#e0e0e0' : 'white',
        }}
      >
        <img
          src={hotspot.imageUrl}
          alt={hotspot.label}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '5px 0',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          {hotspot.label}
        </div>
      </div>
    ))}
  </div>
)}
      {/* Toggle Button for the Panel */}
      {!isStereoVRMode && ( <button
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
        </button>)}

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
 {isStereoVRMode ? (
  <div className="stereo-vr-container" style={{ display: 'flex', width: '100vw', height: '100vh' }}>
    <a-scene embedded style={{ width: '50vw', height: '100vh' }}>
      <a-camera position={`-0.03 0 ${cameraZ}`}>
        {/* Add crosshair for left eye view */}
        <a-entity
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
          material="color: white; shader: flat"
        ></a-entity>
      </a-camera>
      <a-sky src={imageUrl || initialImageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}></a-sky>
    </a-scene>
    <a-scene embedded style={{ width: '50vw', height: '100vh' }}>
      <a-camera position={`0.03 0 ${cameraZ}`}>
        {/* Add crosshair for right eye view */}
        <a-entity
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
          material="color: white; shader: flat"
        ></a-entity>
      </a-camera>
      <a-sky src={imageUrl || initialImageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}></a-sky>
    </a-scene>
  </div>
) : (
      <a-scene embedded style={{ height: '100vh', width: '100vw' }}>
      <a-sky src={imageUrl || initialImageUrl} rotation={`${rotation.x} ${rotation.y} ${rotation.z}`} key={imageUrl}></a-sky>

        <a-camera position={`0 0 ${cameraZ}`}></a-camera>
      </a-scene>)}

      {showGallery && (
        <Gallery images={additionalImages} onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
};

export default PhotoSphere;
