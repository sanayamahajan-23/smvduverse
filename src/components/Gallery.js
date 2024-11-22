import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Gallery.css";

const Gallery = ({ images, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const fullscreenSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: fullscreenIndex,
    arrows: true,
    beforeChange: (current, next) => setFullscreenIndex(next),
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  // Close fullscreen modal
  const closeFullscreen = (e) => {
    setIsFullscreen(false);
    e.stopPropagation();
  };

  return (
    <div>
      {/* Gallery panel */}
      <div className="gallery-panel">
        <button className="close-gallery" onClick={onClose}>
          X
        </button>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-image"
              onClick={() => openFullscreen(index)}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <button className="close-fullscreen" onClick={closeFullscreen}>
            X
          </button>
          <div
            className="fullscreen-slider-container"
            onClick={(e) => e.stopPropagation()} // Prevent propagation to modal close handler
          >
            <Slider {...fullscreenSettings}>
              {images.map((image, index) => (
                <div key={index} className="fullscreen-slide">
                  <img
                    src={image}
                    alt={`Fullscreen Slide ${index + 1}`}
                    className="fullscreen-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
