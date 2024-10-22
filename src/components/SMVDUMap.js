import React, { useState, useEffect, useRef } from 'react';
import './CloudTransition.css'; 
import './SMVDUMap.css'
import Hotspot from './Hotspot';
import PhotoSphere from './PhotoSphereViewer';
const SMVDUMap = () => {
  const [isCloudVisible, setIsCloudVisible] = useState(true);
  const [shouldReveal, setShouldReveal] = useState(false); 
  const [isLoaded, setIsLoaded] = useState(false); 
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false); 
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);
  const [figurinePosition, setFigurinePosition] = useState({ x: 20, y: 300 });
  const [isFigurineDragging, setIsFigurineDragging] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null); 
  const hotspots = [
    { x: 120, y: 570, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Gate 2' },
    { x: 90, y: 280, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Sports Complex' },
    { x: 300, y: 390, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'New Basholi' },
    { x: 359, y:323, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Nilgiri' },
    { x: 350, y: 190, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Vindhyachal' },
    { x: 435, y: 225, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Trikuta' },
    { x: 439, y: 270, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Kailash' },
    { x: 400, y: 247, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Central Gym/Mess' },
    { x: 595, y: 242, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Red Rocks' },
    { x: 640, y: 242, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Fountain Area' },
    { x: 620, y: 310, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Central Library' },
    { x: 980, y: 450, imageUrl: `${process.env.PUBLIC_URL}/assets/vaishnavi.jpeg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.png`, `${process.env.PUBLIC_URL}/assets/photo1.png`, `${process.env.PUBLIC_URL}/assets/photo1.png`, `${process.env.PUBLIC_URL}/assets/photo1.png`], label: 'Vaishnavi' },
    { x: 1030, y: 380, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Guest House' },
    { x: 1100, y: 390, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Residential Area' },
    { x:910, y: 305, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Medical Aid Center' },
    { x:925, y: 290, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Grocery' },
    { x:910, y: 245, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Shivalik A' },
    { x:910, y: 180, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Shivalik B' },
    { x:1050, y: 80, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Helipad'},
    { x:810, y: 110, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Tennis Court'},
    { x:790, y: 60, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Workshop'},
    { x:710, y: 40, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Civil Building'},
    { x:630, y: 20, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'School Of Architecture & Design'},
    { x:540, y: 40, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Parking'},
    { x:550, y: 130, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Matrika'},
    { x:610, y: 170, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Administrative Block'},
    { x:660, y: 160, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'School of Computer Science'},
    { x:700, y: 150, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'LT3/4'},
    { x:700, y: 210, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'School of Business Management'},
    { x:700, y: 240, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'School of Language/Philosophy'},
    { x:710, y: 305, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'LT1/2'},
    { x:750, y: 300, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Block A'},
    { x:755, y: 265, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Block B'},
    { x:775, y: 225, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'BC Junction/TBIC'},
    { x:755, y: 195, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Block C'},
    { x:745, y: 155, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Block D'},
    { x:720, y: 150, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'J&K Bank'},
    { x:680, y: 300, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Research Block'},
    { x:840, y: 430, imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,galleryImages: [`${process.env.PUBLIC_URL}/assets/photo1.jpg`, `${process.env.PUBLIC_URL}/assets/photo2.jpg`], label: 'Gate 1' },
  ];

  const handleHotspotClick = (imageUrl,galleryImages) => {
    setSelectedPhoto(imageUrl);
    setSelectedGalleryImages(galleryImages);
  };

  const closePhotoSphere = () => {
    setSelectedPhoto(null);
    setSelectedGalleryImages([]);
  };
  useEffect(() => {
    const mapImage = new Image();
    const cloudImage = new Image();
    
    mapImage.src = `${process.env.PUBLIC_URL}/assets/smvdu.jpg`;
    cloudImage.src = `${process.env.PUBLIC_URL}/assets/cloud.png`;
    Promise.all([
      new Promise((resolve) => {
        mapImage.onload = resolve;
      }),
      new Promise((resolve) => {
        cloudImage.onload = resolve;
      }),
    ]).then(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setShouldReveal(true); 
      }, 1000); 
      setTimeout(() => {
        setIsCloudVisible(false);
      }, 5000);
    });
  }, []);
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 200));
  };
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1)); 
  };
  const handleRefresh = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };
  const handleMouseUp = () => {
    setDragging(false);
    setIsFigurineDragging(false);
  };
  const handleMouseLeave = () => {
    setDragging(false);
    setIsFigurineDragging(false);
  };
    
  const handleFigurineMouseDown = (e) => {
    e.stopPropagation();
    setIsFigurineDragging(true);
    setStartPosition({
      x: e.clientX - figurinePosition.x,
      y: e.clientY - figurinePosition.y,
    });
  };
  
  useEffect(() => {
    if (isFigurineDragging) {
      window.addEventListener('mousemove', handleFigurineMouseMove);
      window.addEventListener('mouseup', handleFigurineMouseUp);
    } else {
      window.removeEventListener('mousemove', handleFigurineMouseMove);
      window.removeEventListener('mouseup', handleFigurineMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleFigurineMouseMove);
      window.removeEventListener('mouseup', handleFigurineMouseUp);
    };
  }, [isFigurineDragging]);
  
  const handleFigurineMouseMove = (e) => {
    if (!isFigurineDragging) return;
  
    const newPosition = {
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    };
  
    setFigurinePosition(newPosition);
  
    // Check if figurine overlaps with any hotspot
    let closestHotspot = null;
  
    hotspots.forEach((hotspot) => {
      const hotspotLeft = hotspot.x * scale + position.x;
      const hotspotTop = hotspot.y * scale + position.y;
      const hotspotRight = hotspotLeft + 30; // Adjust width for accurate hitbox
      const hotspotBottom = hotspotTop + 30; // Adjust height for accurate hitbox
  
      // Check if figurine is inside the hotspot's bounds
      if (
        newPosition.x + 40 >= hotspotLeft && // Consider figurine width (40px in this case)
        newPosition.x <= hotspotRight &&
        newPosition.y + 70 >= hotspotTop &&  // Consider figurine height (70px in this case)
        newPosition.y <= hotspotBottom
      ) {
        closestHotspot = hotspot;
      }
    });
  
    // Set the hovered hotspot
    setHoveredHotspot(closestHotspot);
  };
  
  
  const handleFigurineMouseUp = () => {
    setIsFigurineDragging(false);
  
    // Remove event listeners when drag ends
    window.removeEventListener('mousemove', handleFigurineMouseMove);
    window.removeEventListener('mouseup', handleFigurineMouseUp);
  
    if (hoveredHotspot) {
      // Use a slight delay to simulate 1ms logic
      setTimeout(() => {
        handleHotspotClick(hoveredHotspot.imageUrl); // Trigger the 360° view
      }, 1);
    }
  };
  // Search and suggestion logic
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.length > 0) {
      const filteredSuggestions = hotspots.filter((hotspot) =>
        hotspot.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (hotspot) => {
    const zoomLevel = 3; // Increased zoom level
  
    // Calculate new position to center the hotspot on the screen
    const newPosX = -hotspot.x * zoomLevel + mapRef.current.offsetWidth / 2;
    const newPosY = -hotspot.y * zoomLevel + mapRef.current.offsetHeight / 2;
  
    // Ensure the position doesn't go out of bounds when zoomed in
    const boundedX = Math.max(Math.min(newPosX, 0), -mapRef.current.offsetWidth * zoomLevel + window.innerWidth);
    const boundedY = Math.max(Math.min(newPosY, 0), -mapRef.current.offsetHeight * zoomLevel + window.innerHeight);
  
    // Set the new position and zoom level
    setPosition({ x: boundedX, y: boundedY });
    setScale(zoomLevel); // Apply the increased zoom level
    setSearchText(hotspot.label);
    setSuggestions([]); // Clear suggestions
  };
  
  const cloudStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/cloud.png)`,
  };
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', backgroundColor: 'black' }}>
      {isLoaded && !selectedPhoto && ( // Only show the map if no photo sphere is selected
        <div
          className="zoom-container"
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/smvdu.jpg`}
            alt="SMVDU Landscape"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              objectFit: 'cover',
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          />
          {hotspots.map((hotspot, index) => (
            <Hotspot
              key={index}
              x={hotspot.x}
              y={hotspot.y}
              onClick={() => handleHotspotClick(hotspot.imageUrl,hotspot.galleryImages)}
              label={hotspot.label}
              scale={scale}
              position={position}
            />
          ))}
        </div>
      )}
       <div className="search-container" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search for a location..."
          style={{ padding: '8px', width: '200px' }}
        />
        {suggestions.length > 0 && (
          <div className="suggestions-box" style={{ backgroundColor: 'white', padding: '10px' }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {suggestion.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Show the Photo Sphere when a photo is selected */}
      {selectedPhoto && (
        <PhotoSphere imageUrl={selectedPhoto}   additionalImages={selectedGalleryImages}  onClose={closePhotoSphere} />
      )}

      {/* Conditionally render zoom controls and figurine */}
      {!selectedPhoto && isLoaded && (
        <>
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomIn}>+</button>
            <button className="zoom-button" onClick={handleRefresh}>
              <img src={`${process.env.PUBLIC_URL}/assets/reload.png`} alt="Refresh" style={{ width: '24px', height: '24px' }} />
            </button>
            <button className="zoom-button" onClick={handleZoomOut}>-</button>
          </div>

          <div
            className="figurine"
            style={{
              position: 'absolute',
              left: `${figurinePosition.x}px`,
              top: `${figurinePosition.y}px`,
              zIndex: 1000,
              cursor: 'pointer',
              width: '40px',
              height: '70px',
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/figurine.png)`,
              backgroundSize: 'cover',
              border: hoveredHotspot ? '2px solid yellow' : 'none',
            }}
            onMouseDown={handleFigurineMouseDown}
            onMouseMove={handleFigurineMouseMove}
            onMouseUp={handleFigurineMouseUp}
          />
        </>
      )}

      {/* Cloud transition */}
      {isCloudVisible && isLoaded && (
        <>
          <div className={`cloud cloud-left ${shouldReveal ? 'reveal-left' : ''}`} style={{ ...cloudStyle }} />
          <div className={`cloud cloud-right ${shouldReveal ? 'reveal-right' : ''}`} style={{ ...cloudStyle }} />
        </>
      )}
    </div>
    
  );
  
};

export default SMVDUMap;
