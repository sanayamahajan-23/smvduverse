import React, { useEffect, useRef, useState } from "react";
import Marzipano from "marzipano";
import "aframe";
import "./PhotoSphereViewer.css";
import Gallery from "./Gallery";

const PhotoSphere = ({
  hotspots,
  nonMappedHotspots,
  currentHotspotIndex,
  setCurrentHotspotIndex,
  onClose,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: -130, z: 0 }); // Initial rotation
  const [cameraZ, setCameraZ] = useState(-5);
  const [isStereoVRMode, setIsStereoVRMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const viewerRef = useRef(null);
  const sceneRef = useRef(null);
  const viewerContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutorotating, setIsAutorotating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHotspotsPanel, setShowHotspotsPanel] = useState(false);
  const initialFov = 1.0; // Set your desired initial FOV value
  const autorotateDelay = 3000; // Delay before autorotation starts (in milliseconds)
  const autorotateSpeed = 0.001; // Adjust the rotation speed
  const combinedHotspots = [...hotspots, ...nonMappedHotspots];
  // Timer reference for autorotation
  const autorotationTimer = useRef(null);
  const handleImageClick = (index) => {
    setCurrentHotspotIndex(index);
    setShowMenu(false); // Hide the menu when an image is clicked
  };
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
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isStereoVRMode, isDragging, lastMousePosition]);
  useEffect(() => {
    if (!isStereoVRMode) {
      initializeViewer();
    }
    return () => cleanupViewer();
  }, [currentHotspotIndex, isStereoVRMode]);

  const initializeViewer = () => {
    clearTimeout(autorotationTimer.current);
    autorotationTimer.current = setTimeout(() => {
      setIsAutorotating(true);
    }, autorotateDelay);

    if (!viewerRef.current) {
      viewerRef.current = new Marzipano.Viewer(viewerContainerRef.current);
    }

    const viewer = viewerRef.current;

    // Check for valid currentHotspotIndex
    if (
      currentHotspotIndex < 0 ||
      currentHotspotIndex >= combinedHotspots.length
    ) {
      console.error("Invalid currentHotspotIndex:", currentHotspotIndex);
      return; // Prevent further execution
    }

    const currentHotspot = combinedHotspots[currentHotspotIndex];

    // Ensure currentHotspot is defined
    if (!currentHotspot) {
      console.error("Current hotspot is undefined:", currentHotspotIndex);
      return; // Prevent further execution
    }

    const source = Marzipano.ImageUrlSource.fromString(currentHotspot.imageUrl);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4096,
      (150 * Math.PI) / 180
    );
    const view = new Marzipano.RectilinearView({ fov: initialFov }, limiter);

    sceneRef.current = viewer.createScene({ source, geometry, view });
    sceneRef.current.switchTo();

    // Ensure linkedHotspots are defined
    if (Array.isArray(currentHotspot.linkedHotspots)) {
      currentHotspot.linkedHotspots.forEach((linkedHotspot) => {
        addArrowMarker(viewer, currentHotspot, linkedHotspot);
      });
    } else {
      console.warn(
        "No linked hotspots available for current hotspot:",
        currentHotspotIndex
      );
    }

    viewerContainerRef.current.addEventListener(
      "mousedown",
      handleUserInteraction
    );
    viewerContainerRef.current.addEventListener(
      "touchstart",
      handleUserInteraction
    );
  };

  const cleanupViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }
    clearTimeout(autorotationTimer.current);

    if (viewerContainerRef.current) {
      viewerContainerRef.current.removeEventListener(
        "mousedown",
        handleUserInteraction
      );
      viewerContainerRef.current.removeEventListener(
        "touchstart",
        handleUserInteraction
      );
    }
  };

  const addArrowMarker = (viewer, sourceHotspot, linkedHotspot) => {
    const arrowElement = document.createElement("div");
    arrowElement.className = "arrow-marker";
    arrowElement.textContent = "➔";
    arrowElement.style.position = "absolute";

    const position = {
      yaw: (linkedHotspot.longitude || 0) * (Math.PI / 180),
      pitch: (linkedHotspot.latitude || 0) * (Math.PI / 180),
    };

    sceneRef.current.hotspotContainer().createHotspot(arrowElement, position);

    arrowElement.addEventListener("click", () => {
      // Find the target hotspot in the combined hotspots array
      const targetHotspot = combinedHotspots.find(
        (h) => h.id === linkedHotspot.id
      );
      if (targetHotspot) {
        setCurrentHotspotIndex(combinedHotspots.indexOf(targetHotspot));
      }
    });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerContainerRef.current.requestFullscreen) {
        viewerContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const zoomView = (deltaFov) => {
    if (sceneRef.current) {
      const view = sceneRef.current.view();
      if (view) {
        const currentFov = view.fov();
        const newFov = Math.min(Math.max(currentFov + deltaFov, 0.05), 15.0);
        view.setFov(newFov);
        resetAutorotation();
      }
    }
  };

  const refreshView = () => {
    if (sceneRef.current) {
      const view = sceneRef.current.view();
      if (view) {
        view.setYaw(0);
        view.setPitch(0);
        view.setFov(initialFov);
        resetAutorotation();
      }
    }
  };

  const rotateView = (deltaYaw, deltaPitch) => {
    if (sceneRef.current) {
      const view = sceneRef.current.view();
      if (view) {
        const currentYaw = view.yaw();
        const currentPitch = view.pitch();
        view.setYaw(currentYaw + deltaYaw);
        view.setPitch(currentPitch + deltaPitch);
        resetAutorotation();
      }
    }
  };

  const resetAutorotation = () => {
    setIsAutorotating(false);
    clearTimeout(autorotationTimer.current);
    autorotationTimer.current = setTimeout(() => {
      setIsAutorotating(true);
    }, autorotateDelay);
  };

  const handleUserInteraction = () => {
    resetAutorotation();
  };

  useEffect(() => {
    if (isAutorotating) {
      const autoRotateInterval = setInterval(() => {
        if (sceneRef.current) {
          const view = sceneRef.current.view();
          if (view) {
            view.setYaw(view.yaw() + autorotateSpeed);
          }
        }
      }, 16);
      return () => clearInterval(autoRotateInterval);
    }
  }, [isAutorotating]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleStereoVRMode = () => {
    setIsStereoVRMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        // Disable auto-rotation when entering VR mode
        setIsAutorotating(false);
      }
      return newMode;
    });
  };
  const handlePrev = () => {
    const prevIndex =
      (currentHotspotIndex - 1 + hotspots.length) % hotspots.length;
    setCurrentHotspotIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentHotspotIndex + 1) % hotspots.length;
    setCurrentHotspotIndex(nextIndex);
  };
  return (
    <div>
      {!isStereoVRMode && (
        <div
          ref={viewerContainerRef}
          id="viewer"
          style={{ height: "100vh", width: "100vw", position: "relative" }}
        >
          <div className="photosphere-overlay">
            <>
              <button
                className="close-button"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "10px",
                  zIndex: 100,
                }}
              >
                X
              </button>
              <button
                className="fullscreen-button"
                onClick={toggleFullscreen}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "50px",
                  zIndex: 100,
                }}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  zIndex: 100,
                }}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  zIndex: 100,
                }}
              >
                Next
              </button>
              <button
                onClick={toggleStereoVRMode}
                style={{
                  position: "absolute",
                  top: "20PX",
                  left: "10px",
                  zIndex: 100,
                }}
              >
                Enter VR
              </button>
              <button
                className="gallery-button"
                onClick={() => setShowGallery(!showGallery)}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "100px",
                  zIndex: 100,
                }}
              >
                {showGallery ? "Hide Gallery" : "Show Gallery"}
              </button>
              <button
                className="menu-button"
                onClick={() => setShowHotspotsPanel(!showHotspotsPanel)} // Toggle the menu visibility
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "200px",
                  zIndex: 100,
                }}
              >
                {showHotspotsPanel ? "Hide Hotspots" : "Show Hotspots"}
              </button>
              {/* Gallery Component */}
              {showGallery && (
                <Gallery
                  images={
                    Array.isArray(
                      combinedHotspots[currentHotspotIndex]?.galleryImages
                    )
                      ? combinedHotspots[currentHotspotIndex].galleryImages
                      : []
                  }
                  onClose={() => setShowGallery(false)}
                />
              )}
              {/* Hotspot Menu Panel */}
              {showHotspotsPanel && (
                <div
                  className="hotspots-panel"
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    zIndex: 100,
                    maxHeight: "400px", // Limit the height of the panel
                    overflowY: "auto", // Enable vertical scrolling
                    width: "200px", // Set a width for the panel
                  }}
                >
                  {hotspots.map((hotspot, index) => {
                    const isSelected = index === currentHotspotIndex; // Check if this hotspot is selected
                    return (
                      <div
                        key={index}
                        onClick={() => handleImageClick(index)}
                        style={{
                          position: "relative", // Position for absolute children
                          cursor: "pointer",
                          marginBottom: "10px", // Space between items
                          border: isSelected ? "2px solid white" : "none", // White outline if selected
                          borderRadius: "5px", // Rounded corners for the outline
                          overflow: "hidden", // Ensures the outline follows the rounded corners
                        }}
                      >
                        <img
                          src={hotspot.imageUrl}
                          alt={hotspot.label}
                          style={{
                            width: "100%", // Full width of the container
                            height: "auto", // Maintain aspect ratio
                            borderRadius: "5px", // Rounded corners for images
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0", // Position the label at the bottom of the image
                            left: "0", // Align to the left
                            width: "100%", // Full width of the container
                            color: "white", // Label text color
                            backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker semi-transparent background
                            padding: "10px 5px", // Padding around the text
                            borderRadius: "0 0 5px 5px", // Rounded corners at the bottom
                            boxSizing: "border-box", // Include padding in width calculation
                            border: isSelected ? "2px solid white" : "none", // White outline if selected
                          }}
                        >
                          {hotspot.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rotation Controls */}
              <div
                className="rotation-controls"
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  zIndex: 100,
                }}
              >
                <button onClick={() => rotateView(0, 0.1)}>Down</button>
                <button onClick={() => rotateView(0.1, 0)}>Right</button>
                <button onClick={() => rotateView(-0.1, 0)}>Left</button>
                <button onClick={() => rotateView(0, -0.1)}>Up</button>
              </div>

              <div
                className="zoom-controls"
                style={{
                  position: "absolute",
                  bottom: "80px",
                  left: "20px",
                  zIndex: 100,
                }}
              >
                <button onClick={() => zoomView(-0.2)}>Zoom In</button>{" "}
                {/* Small zoom in increment */}
                <button onClick={() => zoomView(0.2)}>Zoom Out</button>{" "}
                {/* Small zoom out increment */}
                <button onClick={refreshView}>Refresh</button>
              </div>
            </>
          </div>
        </div>
      )}
      {isStereoVRMode && (
        <div
          className="stereo-vr-container"
          style={{ display: "flex", width: "100vw", height: "100vh" }}
        >
          <a-scene embedded style={{ width: "50vw", height: "100vh" }}>
            <a-camera position={`-0.03 0 ${cameraZ}`}>
              {/* Add crosshair for left eye view */}
              <a-entity
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
                material="color: white; shader: flat"
              ></a-entity>
            </a-camera>
            <a-sky
              src={combinedHotspots[currentHotspotIndex].imageUrl}
              rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            ></a-sky>
          </a-scene>
          <a-scene embedded style={{ width: "50vw", height: "100vh" }}>
            <a-camera position={`0.03 0 ${cameraZ}`}>
              {/* Add crosshair for right eye view */}
              <a-entity
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
                material="color: white; shader: flat"
              ></a-entity>
            </a-camera>
            <a-sky
              src={combinedHotspots[currentHotspotIndex].imageUrl}
              rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
            ></a-sky>
          </a-scene>
          <button
            onClick={toggleStereoVRMode}
            style={{
              position: "absolute",
              top: "20px",
              right: "10px",
              zIndex: 100,
            }}
          >
            Exit VR
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoSphere;
