import React, { useState } from "react";
import "./Medical.css";
import { useNavigate } from "react-router-dom";

const medicalPlaces = [
  {
    name: "Narayana Hospital",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/hospital1.png`,
    description:
      "Located near SMVDU in Kakryal, this is a full-fledged hospital with emergency care, diagnostics, and multi-specialty treatment. It’s the primary healthcare center for students and residents in the area.",
    gallery: [
      `${process.env.PUBLIC_URL}/assets/nearby places/hospital2.png`,
    //   `${process.env.PUBLIC_URL}/assets/nearby places/sanjeevni3.jpg`,
    ],
  },
  {
    name: "Medical Aid Centre (MAC)",
    image: `${process.env.PUBLIC_URL}/assets/Mac/mac1.jpeg`,
    description: "A basic medical facility within the campus offering  first aid, and Doctor check-up. Ambulance service is also available for emergencies.",
    gallery: [`${process.env.PUBLIC_URL}/assets/Mac/mac3.jpeg`,
        // `${process.env.PUBLIC_URL}/assets/nearby places/devipindi3.jpg`
    ],
  },
  {
    name: "Medical Shop",
    image: `${process.env.PUBLIC_URL}/assets/nearby places/medicalshop.png`,
    description:
      "Outside the campus near Narayana Hospital and the local market, small medical stores provide common medicines, first-aid items, and health essentials—useful for quick, over-the-counter needs.",
    gallery: [`${process.env.PUBLIC_URL}/assets/nearby places/medicalshop1.png`],
  },
];

const Medical = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const openModal = (place) => {
    setSelected(place);
  };

  const closeModal = () => {
    setSelected(null);
  };

  return (
    <div className="Medical-container">
      <h2>Medical</h2>
      <button className="back-button" onClick={() => navigate("/nearby")}>
        ← Back
      </button>
      <div className="card-grid">
        {medicalPlaces.map((place, idx) => (
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

export default Medical;
