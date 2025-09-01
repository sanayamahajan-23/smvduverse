import React, { useState } from "react";
import "./Restaurants.css";
import { useNavigate } from "react-router-dom";

const restaurantsPlaces = [
  {
    name: "Sanjeevani",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/sanjeevni4.png`,
    description:
      "A clean and affordable veg restaurant offering homestyle Indian thalis and snacks. Convenient for hospital visitors and students.",
    gallery: [
      `${process.env.PUBLIC_URL}/assets/nearby places/sanjeevni2.jpg`,
      `${process.env.PUBLIC_URL}/assets/nearby places/sanjeevni3.jpg`,
    ],
  },
  {
    name: "Flames",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/flames1.png`,
    description: "Popular multicuisine restaurant serving North Indian, Chinese, and fast food. Known for good taste and quick service.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/flames2.png`,
        // `${process.env.PUBLIC_URL}/assets/nearby places/devipindi3.jpg`
    ],
  },
  {
    name: "Nirvana",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/nirvana1.png`,
    description:
      "Peaceful café with a cozy vibe, serving continental and fusion dishes. A nice place to relax with friends or have a quiet meal.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/nirvana2.png`],
  },
//   {
//     name: "Jhajjar Kotli",
//     image: `${process.env.PUBLIC_URL}/assets/nearby places/jajjar1.jpg`,
//     description:
//       "A cool picnic spot with a flowing stream, popular among students during summer weekends.",
//     gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/jajjar 2.jpg`],
//   },
];

const Restaurants = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const openModal = (place) => {
    setSelected(place);
  };

  const closeModal = () => {
    setSelected(null);
  };

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <button className="back-button" onClick={() => navigate("/nearby")}>
        ← Back
      </button>
      <div className="card-grid">
        {restaurantsPlaces.map((place, idx) => (
          <div
            key={idx}
            className="place-card"
            onClick={() => openModal(place)}
          >
            <img src={place.image} alt={place.name} />
            <h3>{place.name}</h3>
            <p>{place.description}</p>
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>
            <img
              className="modal-img"
              src={selected.image}
              alt={selected.name}
            />
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            {selected.gallery.length > 0 && (
              <div className="gallery">
                <h4>Gallery</h4>
                <div className="gallery-images">
                  {selected.gallery.map((gImg, index) => (
                    <img key={index} src={gImg} alt="gallery" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
