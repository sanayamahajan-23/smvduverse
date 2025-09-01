import React, { useState } from "react";
import "./Groceries.css";
import { useNavigate } from "react-router-dom";

const groceriesPlaces = [
  {
    name: "Grocery shop",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/grocery2.png`,
    description:
      "Just outside campus, several small grocery shops offer basic household items ,fruits, and vegetables.",
    gallery: [
      `${process.env.PUBLIC_URL}/assets/nearby places/grocery1.png`,
    //   `${process.env.PUBLIC_URL}/assets/nearby places/grocery.png`,
    ],
  },
  {
    name: "Stationary",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/stationary2.png`,
    description: "Located outside SMVDU, this local stationery shop offers notebooks, pens, files, and printing/photocopy services. ",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/stationary1.png`,
        // `${process.env.PUBLIC_URL}/assets/nearby places/devipindi3.jpg`
    ],
  },
];

const Groceries = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const openModal = (place) => {
    setSelected(place);
  };

  const closeModal = () => {
    setSelected(null);
  };

  return (
    <div className="Groceries-container">
      <h2>Groceries</h2>
      <button className="back-button" onClick={() => navigate("/nearby")}>
        ← Back
      </button>
      <div className="card-grid">
        {groceriesPlaces.map((place, idx) => (
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

export default Groceries;
