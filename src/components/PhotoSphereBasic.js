// components/PhotoSphereBasic.js
import React, { useEffect, useRef, useState } from "react";
import Marzipano from "marzipano";
import "./PhotoSphereBasic.css";

const PhotoSphereBasic = ({ imageUrl, onClose }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const autorotationTimer = useRef(null);
  const autorotateDelay = 5000; // 45 seconds
  const autorotateSpeed = 0.001; // radians per frame

  const [isAutorotating, setIsAutorotating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startAutorotation = () => {
    autorotationTimer.current = setTimeout(() => {
      setIsAutorotating(true);
    }, autorotateDelay);
  };

  const stopAutorotation = () => {
    setIsAutorotating(false);
    clearTimeout(autorotationTimer.current);
    startAutorotation();
  };

  useEffect(() => {
    if (!imageUrl || !containerRef.current) return;

    const viewer = new Marzipano.Viewer(containerRef.current);

    const source = Marzipano.ImageUrlSource.fromString(imageUrl);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    const limiter = Marzipano.RectilinearView.limit.traditional(4096, Math.PI);
    const view = new Marzipano.RectilinearView({}, limiter);

    const scene = viewer.createScene({ source, geometry, view });
    scene.switchTo();

    viewerRef.current = viewer;
    startAutorotation();

    const handleUserInteraction = () => {
      stopAutorotation();
    };

    containerRef.current.addEventListener("mousedown", handleUserInteraction);
    containerRef.current.addEventListener("touchstart", handleUserInteraction);

    return () => {
      viewer.destroy();
      clearTimeout(autorotationTimer.current);
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mousedown",
          handleUserInteraction
        );
        containerRef.current.removeEventListener(
          "touchstart",
          handleUserInteraction
        );
      }
    };
  }, [imageUrl]);


  useEffect(() => {
    if (isAutorotating && viewerRef.current) {
      const view = viewerRef.current.view();
      const interval = setInterval(() => {
        view.setYaw(view.yaw() + autorotateSpeed);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isAutorotating]);

  return (
    <div className="photoSphereOverlay">
      <button className="closeButton" onClick={onClose}>✖</button>
      <div ref={containerRef} className="photoSphereContainer" />
    </div>
  );
};

export default PhotoSphereBasic;
