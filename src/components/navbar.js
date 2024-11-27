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
              {/* Close Button */}
              <button
                className="close-button"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "10px",
                  zIndex: 100,
                  color: "black",
                }}
              >
                Close
              </button>
  
              {/* Navbar */}
              <div className="navbar">
                <button className="nav-button"><i className="fas fa-undo"></i></button> {/* Previous */}
                <button className="nav-button"><i className="fas fa-redo"></i></button> {/* Next */}
                <button className="nav-button"><i className="fas fa-search-plus"></i></button> {/* Zoom In */}
                <button className="nav-button"><i className="fas fa-search-minus"></i></button> {/* Zoom Out */}
                <button className="nav-button"><i className="fas fa-sync-alt"></i></button> {/* Refresh */}
                <button className="nav-button"><i className="fas fa-play"></i></button> {/* Play Narration */}
                <button className="nav-button"><i className="fas fa-closed-captioning"></i></button> {/* Subtitles */}
                <button className="nav-button"><i className="fas fa-map-marker-alt"></i></button> {/* Show Hotspots */}
                <button className="nav-button"><i className="fas fa-images"></i></button> {/* Show Gallery */}
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
  