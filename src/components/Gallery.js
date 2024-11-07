import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Gallery.css";

const Gallery = ({ images, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  // Function to open fullscreen modal with selected image
  const openFullscreen = (image) => {
    setSelectedImage(image);
    setIsFullscreen(true);
  };

  // Function to close the fullscreen modal
  const closeFullscreen = () => {
    setSelectedImage(null);
    setIsFullscreen(false);
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
              onClick={() => openFullscreen(image)}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <img
            src={selectedImage}
            alt="Fullscreen view"
            className="fullscreen-image"
          />
          <button className="close-fullscreen" onClick={closeFullscreen}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
