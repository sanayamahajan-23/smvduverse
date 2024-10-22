import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Gallery.css'; // Custom styling for the gallery

const Gallery = ({ images, onClose }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,  // Arrows for navigating forward/backward
  };

  return (
    <div className="gallery-panel">
      <button className="close-gallery" onClick={onClose}>X</button>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="gallery-image">
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Gallery;
