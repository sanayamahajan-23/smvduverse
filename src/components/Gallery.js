import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Gallery.css";

const Gallery = ({ images, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const sliderRef = useRef(null); // Reference to the slider

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    arrows: false, // Disable the default arrows
  };

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

  const moveSlider = (direction) => {
    if (sliderRef.current) {
      if (direction === "up") {
        sliderRef.current.slickPrev(); // Move to the previous slide
      } else {
        sliderRef.current.slickNext(); // Move to the next slide
      }
    }
  };

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

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

        {/* Slider */}
        <Slider {...settings} ref={sliderRef} className="vertical-slider">
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

        <button className="down-arrow" onClick={() => moveSlider("down")}>
          ▼
        </button>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <button className="close-fullscreen" onClick={closeFullscreen}>
            X
          </button>
          <div
            className="fullscreen-slider-container"
            onClick={(e) => e.stopPropagation()}
          >
            <Slider {...fullscreenSettings} className="fullscreen-slider">
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
