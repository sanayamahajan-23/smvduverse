// components/PhotoSphereBasic.js
import React, { useEffect, useRef, useState } from "react";
import Marzipano from "marzipano";
import "./PhotoSphereBasic.css";

const PhotoSphereBasic = ({ imageUrl, onClose }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const autorotationTimer = useRef(null);
  const autorotateDelay = 5000;
  const autorotateSpeed = 0.001;

  const [isAutorotating, setIsAutorotating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    setLoading(true);
    setError(null);
    let cancelled = false;
    let interactionHandler = null;

    // Preload image with CORS to verify it loads before initializing Marzipano
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const viewer = new Marzipano.Viewer(containerRef.current);
        const source = Marzipano.ImageUrlSource.fromString(imageUrl);
        const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
        const limiter = Marzipano.RectilinearView.limit.traditional(
          4096,
          Math.PI
        );
        const view = new Marzipano.RectilinearView({}, limiter);
        const scene = viewer.createScene({ source, geometry, view });
        scene.switchTo();

        viewerRef.current = viewer;
        setLoading(false);
        startAutorotation();

        interactionHandler = () => stopAutorotation();
        containerRef.current.addEventListener("mousedown", interactionHandler);
        containerRef.current.addEventListener("touchstart", interactionHandler);
      } catch (err) {
        console.error("Marzipano init error:", err);
        setError("Failed to initialize 360\u00B0 viewer.");
        setLoading(false);
      }
    };

    img.onerror = () => {
      if (cancelled) return;
      setError(
        "Could not load 360\u00B0 image. The URL may be invalid, expired, or blocked by CORS."
      );
      setLoading(false);
    };

    img.src = imageUrl;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      if (containerRef.current && interactionHandler) {
        containerRef.current.removeEventListener("mousedown", interactionHandler);
        containerRef.current.removeEventListener("touchstart", interactionHandler);
      }
      clearTimeout(autorotationTimer.current);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (isAutorotating && viewerRef.current) {
      const view = viewerRef.current.view();
      const interval = setInterval(() => {
        if (view && view.setYaw) {
          view.setYaw(view.yaw() + autorotateSpeed);
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isAutorotating]);

  return (
    <div className="photoSphereOverlay">
      <button className="closeButton" onClick={onClose}>
        ✖
      </button>

      {loading && (
        <div
          style={{
            color: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10001,
          }}
        >
          Loading 360&deg; view...
        </div>
      )}

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10001,
            textAlign: "center",
            padding: "0 20px",
            maxWidth: "80%",
          }}
        >
          <p>{error}</p>
          <p style={{ color: "#aaa", fontSize: "12px", marginTop: "10px", wordBreak: "break-all" }}>
            URL: {imageUrl}
          </p>
          <button
            onClick={() => window.open(imageUrl, "_blank")}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Open Image Directly
          </button>
        </div>
      )}

      <div ref={containerRef} className="photoSphereContainer" />
    </div>
  );
};

export default PhotoSphereBasic;
