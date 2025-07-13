import React, { useState } from "react";
import "./WeekendTrips.css";
import { useNavigate } from "react-router-dom";

const weekendPlaces = [
  {
    name: "Vaishno Devi Temple",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/vaishnodevi1.jpg`,
    description:
      "A highly revered Hindu pilgrimage site dedicated to Goddess Vaishno Devi, located in the Trikuta Mountains.",
    gallery: [
      `${process.env.PUBLIC_URL}/assets/nearby places/vaishnodevi2.jpg`,
      `${process.env.PUBLIC_URL}/assets/nearby places/vaishnodevi3.jpg`,
    ],
  },
  {
    name: "Devi Pindi",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/devipindi1.jpg`,
    description: "Also a very good temple which you should visit.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/devipindi2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/nearby places/devipindi3.jpg`
    ],
  },
  {
    name: "Patnitop",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/patnitop1.jpg`,
    description:
      "A scenic hilltop tourist location ideal for snow, nature walks, and weekend picnics.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/patnitop3.jpeg`],
  },
  {
    name: "Jhajjar Kotli",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/jajjar1.jpg`,
    description:
      "A cool picnic spot with a flowing stream, popular among students during summer weekends.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/jajjar 2.jpg`],
  },
];

const WeekendTrips = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const openModal = (place) => {
    setSelected(place);
  };

  const closeModal = () => {
    setSelected(null);
  };

  return (
    <div className="weekend-container">
      <h2>Weekends Trips</h2>
      <button className="back-button" onClick={() => navigate("/nearby")}>
        ← Back
      </button>
      <div className="card-grid">
        {weekendPlaces.map((place, idx) => (
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

export default WeekendTrips;
