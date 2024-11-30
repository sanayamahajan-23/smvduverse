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
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: -130, z: 0 }); // Initial rotation
  const [cameraZ, setCameraZ] = useState(10);
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
  const [isNarrating, setIsNarrating] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const initialFov = 1.0;
  const autorotateDelay = 3000;
  const autorotateSpeed = 0.001;
  const combinedHotspots = [...hotspots, ...nonMappedHotspots];
  const currentHotspot = combinedHotspots[currentHotspotIndex];
  const autorotationTimer = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hasAutoNarrationPlayed, setHasAutoNarrationPlayed] = useState(false);
  const sensitivity = 0.05; // Sensitivity factor to control speed of movement
  const deadZone = 5; // Ignore small movements around the center
  const maxDistance = 50; // Max distance the circle can move from center
  const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
  const handleMouseDown = (e) => {
    setDragging(true);
    setInitialPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const deltaX = e.clientX - initialPosition.x;
      const deltaY = e.clientY - initialPosition.y;

      // Limit movement within max distance
      const limitedX = Math.min(Math.max(deltaX, -maxDistance), maxDistance);
      const limitedY = Math.min(Math.max(deltaY, -maxDistance), maxDistance);

      // Update the circle's position
      setCirclePosition({
        x: limitedX,
        y: limitedY,
      });

      // Calculate rotation direction based on drag, considering sensitivity
      if (Math.abs(limitedX) > deadZone || Math.abs(limitedY) > deadZone) {
        const moveX = (limitedX * sensitivity) / 100;
        const moveY = (limitedY * sensitivity) / 100;

        rotateView(moveX, moveY); // Trigger rotation based on controlled movement
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setCirclePosition({ x: 0, y: 0 }); // Animate back to center
  };

  useEffect(() => {
    // Add event listeners for mousemove and mouseup for dragging
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, initialPosition]);
  useEffect(() => {
    // Stop narration whenever the component unmounts or the hotspot/view changes
    return () => {
      speechSynthesis.cancel();
      setIsNarrating(false); // Reset narrating state
    };
  }, [currentHotspotIndex, onClose]); // Run when hotspot index changes or when the component is unmounted

  const playNarration = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    // Stop any existing narration
    speechSynthesis.cancel();

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Speech settings
      utterance.rate = 0.9;
      utterance.pitch = 1.4;
      utterance.volume = 1;

      // Select a preferred voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      utterance.voice = preferredVoice || voices[0];

      // Start narration
      speechSynthesis.speak(utterance);

      // Set narration end handler to update state
      utterance.onend = () => {
        setIsNarrating(false);
      };

      setIsNarrating(true);
    }
  };

  // Trigger narration on hotspot change
  useEffect(() => {
    if (currentHotspot && currentHotspot.subtitle) {
      playNarration(currentHotspot.subtitle);
    } else {
      speechSynthesis.cancel();
    }
  }, [currentHotspot]);
  useEffect(() => {
    // Stop any ongoing narration if the current hotspot changes or is closed
    if (isNarrating) {
      // If the current hotspot is null or closed, stop the narration
      if (!currentHotspot || !currentHotspot.subtitle) {
        speechSynthesis.cancel();
        setIsNarrating(false); // Reset narrating state
        setSubtitle(""); // Clear subtitle
        setIsSubtitleVisible(false); // Hide subtitle box
      }
    }

    // Automatically play narration for the new hotspot after a small delay
    if (currentHotspot && currentHotspot.subtitle) {
      const narrationDelay = setTimeout(() => {
        playNarration(currentHotspot.subtitle || "");
        setIsNarrating(true); // Mark as narrating
        setHasAutoNarrationPlayed(false); // Reset auto narration play status for next time
      }, 1000); // 1-second delay after hotspot change

      // Cleanup timeout on component unmount or when currentHotspotIndex changes
      return () => clearTimeout(narrationDelay);
    }
  }, [currentHotspotIndex, currentHotspot]); // This will trigger when currentHotspotIndex changes or currentHotspot changes

  const toggleNarration = () => {
    const text = `${currentHotspot.subtitle || ""}`;

    if (isNarrating) {
      // Stop narration
      speechSynthesis.cancel();
      setIsNarrating(false); // Mark as not narrating
      setSubtitle(""); // Ensure subtitle box doesn't show
    } else {
      // Play narration
      if (text) {
        playNarration(text);
        setIsNarrating(true); // Mark as narrating
        setSubtitle(""); // Ensure subtitle box doesn't show
      }
    }
  };

  const showSubtitle = () => {
    const text = `${
      currentHotspot.subtitle || "No additional details available."
    }`;
    setSubtitle(text);
    setIsSubtitleVisible(true); // Ensure subtitle is visible
  };

  const closeSubtitle = () => {
    setIsSubtitleVisible(false); // Close the subtitle box
    setSubtitle(""); // Clear subtitle
  };

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
  useEffect(() => {
    if (!viewerRef.current || !currentHotspot) return;

    const viewer = viewerRef.current;
    const view = viewer.view();

    // Function to calculate 3D position to screen coordinates
    const updateLabelPosition = () => {
      const { yaw, pitch } = currentHotspot; // Assuming currentHotspot has `yaw` and `pitch`

      // Convert spherical coordinates (yaw, pitch) to 2D screen coordinates
      const screenPosition = view.coordinatesToScreen({ yaw, pitch });

      if (screenPosition) {
        setCirclePosition({
          x: screenPosition.x,
          y: screenPosition.y,
        });
      }
    };

    // Update position initially and on view change
    updateLabelPosition();
    view.addEventListener("change", updateLabelPosition);

    // Cleanup event listener on unmount
    return () => {
      view.removeEventListener("change", updateLabelPosition);
    };
  }, [currentHotspot, viewerRef]);

  const addArrowMarker = (viewer, sourceHotspot, linkedHotspot) => {
    const arrowElement = document.createElement("div");
    arrowElement.className = "arrow-marker";
    arrowElement.textContent = "🡩"; // Upward arrow symbol
    arrowElement.style.position = "absolute";

    // Tooltip for showing the hotspot label
    const labelElement = document.createElement("div");
    labelElement.className = "hotspot-label";
    labelElement.textContent = linkedHotspot.label || "Hotspot"; // Set label text
    labelElement.style.position = "absolute";
    labelElement.style.visibility = "hidden"; // Initially hidden
    labelElement.style.opacity = 0;
    labelElement.style.transition = "opacity 0.3s ease";

    // Add the marker to the scene
    const position = {
      yaw: (linkedHotspot.longitude || 0) * (Math.PI / 180),
      pitch: (linkedHotspot.latitude || 0) * (Math.PI / 180),
    };
    sceneRef.current.hotspotContainer().createHotspot(arrowElement, position);
    sceneRef.current.hotspotContainer().createHotspot(labelElement, position);

    // Show label on hover
    arrowElement.addEventListener("mouseenter", () => {
      labelElement.style.visibility = "visible";
      labelElement.style.opacity = 1;
    });

    // Hide label when not hovering
    arrowElement.addEventListener("mouseleave", () => {
      labelElement.style.visibility = "hidden";
      labelElement.style.opacity = 0;
    });

    // Click event to navigate to the hotspot
    arrowElement.addEventListener("click", () => {
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
  const toggleHotspotsPanel = () => {
    setShowHotspotsPanel(!showHotspotsPanel); // Toggle visibility of the hotspots panel
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
    <>
      <div>
        {!isStereoVRMode && (
          <div
            ref={viewerContainerRef}
            id="viewer"
            style={{ height: "100vh", width: "100vw", position: "relative" }}
          >
            <button
              onClick={() => setIsControlPanelVisible(!isControlPanelVisible)}
              style={{
                position: "absolute",
                bottom: "1px",
                right: "25px",
                zIndex: 2000,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              title={isControlPanelVisible ? "Hide Controls" : "Show Controls"}
            >
              <i
                className={
                  isControlPanelVisible ? "fas fa-eye-slash" : "fas fa-eye"
                } // Icon toggle
                style={{ fontSize: "15px" }} // Adjust icon size
              ></i>
            </button>
            {currentHotspot && isControlPanelVisible && (
              <div
                style={{
                  position: "absolute",
                  left: "170px", // Dynamically position based on hotspot x
                  top: "35px", // Dynamically position based on hotspot y
                  transform: "translate(-50%, -100%)", // Adjust to place the label slightly above the hotspot
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                  zIndex: 1000,
                  pointerEvents: "none", // Ensure the label is non-interactive
                  whiteSpace: "nowrap", // Prevent label from wrapping
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {currentHotspot.label}
              </div>
            )}
            {isControlPanelVisible && (
              <div className="control-panel">
                <button
                  className="control-button"
                  onClick={onClose}
                  title="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
                <button
                  className="control-button"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  <i
                    className={
                      isFullscreen ? "fas fa-compress" : "fas fa-expand"
                    }
                  ></i>
                </button>
                <button
                  className="control-button"
                  onClick={handlePrev}
                  title="Previous"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <button
                  className="control-button"
                  onClick={handleNext}
                  title="Next"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
                <button
                  className="control-button"
                  onClick={toggleNarration}
                  title={isNarrating ? "Stop Narration" : "Play Narration"}
                >
                  <i
                    className={isNarrating ? "fas fa-stop" : "fas fa-play"}
                  ></i>
                </button>
                <button
                  className="control-button"
                  onClick={showSubtitle}
                  title="Show Subtitle"
                >
                  <i className="fas fa-closed-captioning"></i>
                </button>
                {isSubtitleVisible && subtitle && (
                  <div
                    className="subtitle-box"
                    style={{
                      position: "fixed", // Use fixed to anchor to the viewport
                      bottom: "108px", // Adjust as needed for spacing
                      left: "50%", // Center horizontally
                      transform: "translateX(-50%)", // Perfect horizontal centering
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Slightly darker for contrast
                      color: "white",
                      padding: "15px",
                      borderRadius: "5px",
                      textAlign: "center",
                      zIndex: 1000, // Make sure it stays above everything else
                    }}
                  >
                    <div>{subtitle}</div>
                    {/* Close Button for Subtitle Box */}
                    <button
                      onClick={closeSubtitle}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        color: "white", // Text color for "X"
                        background: "none", // Remove background
                        border: "none", // Remove border
                        padding: "10px",
                        fontSize: "15px", // Optional: adjust the size of the "X"
                        cursor: "pointer", // Ensure it's clickable
                      }}
                    >
                      X
                    </button>
                  </div>
                )}
                <button
                  className="control-button"
                  onClick={toggleStereoVRMode}
                  title="Enter VR Mode"
                >
                  <i className="fas fa-vr-cardboard"></i>
                </button>
                <button
                  className="control-button"
                  onClick={() => setShowGallery(!showGallery)}
                  title={showGallery ? "Hide Gallery" : "Show Gallery"}
                >
                  <i className="fas fa-images"></i>
                </button>
                <button
                  className="control-button"
                  onClick={() => setShowHotspotsPanel(!showHotspotsPanel)}
                  title="Toggle Hotspots"
                >
                  <i className="fas fa-map-marker-alt"></i>
                </button>
                {showGallery && (
                  <Gallery
                    images={
                      combinedHotspots[currentHotspotIndex]?.galleryImages || []
                    }
                    onClose={() => setShowGallery(false)}
                  />
                )}
                {showHotspotsPanel && (
                  <div
                    className="hotspots-panel"
                    style={{
                      position: "absolute",
                      top: "20px", // Distance from the top
                      left: "-205px", // Align to the left side of the viewport
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark semi-transparent background
                      padding: "15px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.3)", // Add subtle shadow
                      zIndex: 101,
                      maxHeight: "400px", // Limit height with scrollable content
                      overflowY: "scroll",
                      width: "170px", // Fixed width
                      height: "80%",
                    }}
                  >
                    {/* Close Button */}
                    <button
                      onClick={toggleHotspotsPanel}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        color: "white",
                        background: "none",
                        border: "none",
                        fontSize: "15px",
                        cursor: "pointer",
                        zIndex: 500,
                      }}
                    >
                      X
                    </button>
                    {/* List of Hotspots */}
                    {hotspots.map((hotspot, index) => (
                      <div
                        key={index}
                        onClick={() => handleImageClick(index)}
                        style={{
                          cursor: "pointer",
                          marginBottom: "10px",
                          border:
                            index === currentHotspotIndex
                              ? "2px solid white"
                              : "none", // Highlight selected
                          borderRadius: "5px",
                          position: "relative",
                        }}
                      >
                        {/* Image */}
                        <img
                          src={hotspot.imageUrl}
                          alt={hotspot.label}
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                        {/* Label over the image */}
                        <span
                          style={{
                            position: "absolute", // Position label over the image
                            bottom: "0px", // Slight padding from the bottom
                            left: "0px", // Slight padding from the left
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
                            padding: "5px 10px", // Padding for the label
                            borderRadius: "0px", // Rounded edges for label
                            fontSize: "12px", // Adjust font size
                            width: "100%",
                          }}
                        >
                          {hotspot.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <style jsx>{`
                  .hotspots-panel::-webkit-scrollbar {
                    width: 0; /* Hides the scrollbar in WebKit browsers */
                  }

                  .hotspots-panel {
                    scrollbar-width: none; /* Hides the scrollbar in Firefox */
                  }
                `}</style>
              </div>
            )}
          </div>
        )}
        {!isStereoVRMode && isControlPanelVisible && (
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "42%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            {/* Circular Disc for Directional Controls */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                marginBottom: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Directional Buttons */}
              <button
                onClick={() => rotateView(0, -0.1)}
                style={{
                  position: "absolute",
                  top: "10px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Up"
              >
                <i className="fas fa-chevron-up"></i>
              </button>

              <button
                onClick={() => rotateView(0.1, 0)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Right"
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              <button
                onClick={() => rotateView(0, 0.1)}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Down"
              >
                <i className="fas fa-chevron-down"></i>
              </button>

              <button
                onClick={() => rotateView(-0.1, 0)}
                style={{
                  position: "absolute",
                  left: "10px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Left"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Drag handle (small circle) */}
              <div
                onMouseDown={handleMouseDown}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${circlePosition.x}px, ${circlePosition.y}px)`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-out", // Smooth transition back to the center
                }}
              />
            </div>
          </div>
        )}
        {!isStereoVRMode && isControlPanelVisible && (
          <div
            className="bottom-panel"
            style={{
              position: "absolute",
              bottom: "25px", // Position from bottom of the viewport
              left: "55%", // Center the panel horizontally
              transform: "translateX(-50%)", // Adjust for perfect centering
              display: "flex", // Flexbox layout to arrange buttons horizontally
              justifyContent: "space-evenly", // Evenly spaced buttons
              width: "15%", // Set the width of the panel to 80% of the viewport
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Black translucent background
              borderRadius: "8px", // Optional: rounded corners for the panel
              padding: "5px", // Padding inside the panel
              zIndex: 100,
            }}
          >
            {/* Zoom Controls */}
            <button onClick={() => zoomView(-0.2)} title="Zoom In">
              <i className="fas fa-search-plus"></i> {/* Icon for Zoom In */}
            </button>
            <button onClick={() => zoomView(0.2)} title="Zoom Out">
              <i className="fas fa-search-minus"></i> {/* Icon for Zoom Out */}
            </button>
            <button onClick={refreshView} title="Refresh">
              <i className="fas fa-sync-alt"></i> {/* Icon for Refresh */}
            </button>
          </div>
        )}
      </div>

      {isStereoVRMode && (
        <div
          className="stereo-vr-container"
          style={{ display: "flex", width: "100vw", height: "100vh" }}
        >
          <a-scene embedded style={{ width: "50vw", height: "100vh" }}>
            <a-camera position={`-0.03 0 ${cameraZ}`}>
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
    </>
  );
};

export default PhotoSphere;
