import React, { useState, useEffect } from "react";
import {
  FaDirections,
  FaShareAlt,
  FaImages,
  FaArrowLeft,
} from "react-icons/fa";
import DirectionsPanel from "./DirectionsPanel";
import "./SidePanel.css";
import Gallery from "./Gallery.js";
// Mock mapped and non-mapped places (Replace with your actual data)
const mappedPlaces = [
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Gate/gate1pic.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Gate/gate2pic.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Gate/gate3pic.jpeg`,
    ],
    label: " Shri Mata Vaishno Devi University",
    subtitle:
      "Main entrance to the campus, welcoming visitors and providing access to the academic and residential areas of the university.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu4.jpeg`,
    ],
    label: "Residential Area",
    subtitle:
      "This area is designated for the accommodation of staff members, providing comfortable living spaces with essential amenities for faculty and employees.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park3.jpeg`,
    ],
    label: "Guest House Park",
    subtitle:
      "A peaceful outdoor park area located near the guest house, offering a relaxing environment with greenery and seating spaces, ideal for leisure and casual gatherings.",
  },
  {
    galleryImages: [
      // `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/Guesthouse1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse4.jpeg`,
    ],
    label: "Guest House",
    subtitle:
      "A comfortable stay for visitors and guests, offering a serene environment with all essential amenities for a restful visit.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-5.jpeg`,
    ],
    label: "Vaishnavi",
    subtitle:
      "Welcome to Vaishnavi, the oldest and one of the most iconic girls' hostels on campus.Its historical significance and close-knit community make it a beloved place on campus, where friendships are formed and memories are made.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Grocery",
    subtitle:
      "A convenient on-campus grocery store offering a wide range of essential items, snacks, and daily necessities for students and faculty, ensuring easy access to everyday products.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Mac/mac1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Mac/mac2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Mac/mac3.jpeg`,
    ],
    label: "Medical Aid Center",
    subtitle:
      "The Medical Aid Center provides immediate healthcare services and first-aid assistance to students and staff.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Shivalik A",
    subtitle:
      "Shivalik A is a modern girls' hostel offering a secure and comfortable environment with essential amenities for students.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Shivalik B",
    subtitle:
      "A newly established girls' hostel, offering comfortable and secure accommodations for female students.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Helipad",
    subtitle:
      "An essential facility for emergency evacuations and official visits, providing swift aerial access to the campus.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Tennis Court",
    subtitle:
      "A well-maintained tennis court offering a great space for sports enthusiasts and students to enjoy recreational activities.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Workshop",
    subtitle:
      "The Mechanical Workshop is renowned for its state-of-the-art machines and equipment, making it the best in Jammu's colleges.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "School Of Architecture & Design",
    subtitle:
      "The School of Architecture & Design offers innovative programs in architecture and design, fostering creativity and technical skills.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Parking",
    subtitle:
      "The parking area is designated for SMVDU buses and visitors, providing convenient parking space for transportation and guests.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Matrika Auditorium",
    subtitle:
      "Matrika is a large auditorium used for lectures, events, and conferences, hosting various academic and cultural activities.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Administrative Block",
    subtitle:
      "The Administrative Block houses various offices including student services, faculty administration, and management offices.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Fountain Area",
    subtitle:
      "A peaceful and scenic spot featuring a beautiful fountain, perfect for relaxation and reflection amidst nature's tranquility.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "J&K Bank",
    subtitle:
      "The J&K Bank branch located at the main entrance to the campus offers various banking services for students, staff, and visitors.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Block D",
    subtitle:
      "Block D houses the Mathematics Department and several Computer Science Engineering (CSE) laboratories, providing essential facilities for research and learning in these disciplines.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Block C",
    subtitle:
      "Block C is home to the departments of Electronics Engineering, Electrical Engineering, and Economics. It serves as a key academic block within the campus, offering advanced learning in these fields.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "BC Junction/TBIC",
    subtitle:
      "BC Junction serves as the main entrance to the campus. It houses the Technology Business Incubator Centre (TBIC) above it, fostering innovation and entrepreneurship. The junction also includes an ATM for convenience.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Block B",
    subtitle:
      "Block B is dedicated to the Mechanical Engineering Department and the Energy Management program. It provides state-of-the-art facilities in mechanical systems and sustainable energy solutions.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Block A",
    subtitle:
      "Block A houses the Biotechnology Department and Physics classrooms. It is a space where students and faculty collaborate on innovative projects, fostering a deep understanding of science and technology.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "LT1/2",
    subtitle:
      "Lecture halls designed to accommodate large classes, equipped with modern amenities for interactive learning and seminars.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "School of Language/Philosophy",
    subtitle:
      "A hub for critical thinking and the study of languages, literature, and philosophy, fostering a deep understanding of culture and thought.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "School of Business Management",
    subtitle:
      "A center of excellence that offers cutting-edge business education, preparing students for leadership roles in the global market.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "LT3/4",
    subtitle:
      "Lecture halls designed for large classes, equipped with modern teaching aids and interactive learning facilities.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "School of Computer Science",
    subtitle:
      "An academic center for computer science education and research, equipped with modern labs and a collaborative learning environment.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Research Block",
    subtitle:
      "A hub for academic research and innovation, providing state-of-the-art facilities and collaborative spaces for students and faculty.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.png`,
      `${process.env.PUBLIC_URL}/assets/photo1.png`,
    ],
    label: "Central Library",
    subtitle:
      "A hub of knowledge and learning, the Central Library offers a peaceful environment for studying and research, with a vast collection of resources.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Red Rocks",
    subtitle:
      "The Red Rocks are a popular spot where students gather to relax, enjoy the view, and socialize, offering a vibrant atmosphere with its distinctive red stairs.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Central Gym/Mess",
    subtitle:
      "The Central Gym/Mess serves as the hub for fitness and dining, providing students with state-of-the-art workout facilities and nutritious meals to support their physical and academic well-being.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Kailash",
    subtitle:
      "Kailash is a boys' hostel offering a comfortable and convenient stay with all necessary amenities to support student life and learning.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Trikuta",
    subtitle:
      "Trikuta is another well-equipped boys' hostel, providing a supportive environment for students with modern facilities and a lively atmosphere.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Vindhyachal",
    subtitle:
      "Vindhyachal is yet another boys' hostel, known for its vibrant community, comfortable living spaces, and amenities that cater to both academic focus and leisure activities.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Nilgiri",
    subtitle:
      "Nilgiri serves as another boys' hostel on campus, offering a peaceful environment with spacious rooms, modern facilities, and a vibrant atmosphere that supports both academic and social activities.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "New Basholi",
    subtitle:
      "New Basholi is a newly built boys' hostel with modern facilities, offering spacious rooms, a recreation area, and a comfortable living environment for students.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
      `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
    ],
    label: "Sports Complex",
    subtitle:
      "The Sports Complex serves as a hub for a variety of athletic activities. It is equipped with modern facilities. This area is a popular gathering spot for fitness enthusiasts, offering a space to engage in physical activity or simply relax and unwind.",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/photo1.png`,
      `${process.env.PUBLIC_URL}/assets/photo1.png`,
    ],
    label: "Gate 2",
    subtitle:
      "This is the second entry point to the premises. It is designated exclusively for pedestrian use, and no vehicles are permitted to pass through this gate at any time.",
  },
];
const nonMappedPlaces = [
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/outsidevaishnavi1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/outsidevaishnavi2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/outsidevaishnavi3.jpeg`,
    ],
    label: "outside vaishnavi",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/vaishnavimaingate1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/vaishnavimaingate2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/vaishnavimaingate3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/vaishnavigate main.jpeg`,
    ],
    label: "Entrance of hostel,guest house and residential area",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/guestpath.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/manumargpath.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathtomanu.jpeg`,
    ],
    label: "path to guest house or margs",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/parking1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/parking2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/path2fromvaishnavi2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/path2fromvaishnavi3.jpeg`,
    ],
    label: "Path 2 from vaishnavi",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika3.jpeg`,
    ],
    label: "Path of Ambika sadan",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga3.jpeg`,
    ],
    label: "path of durga sadan",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathganga1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathganga.jpeg`,
    ],
    label: "Path to sadan",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya4.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya5.jpeg`,
    ],
    label: "Path to ganga and kautalya",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/chanakyapath.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/chanakyapath2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/vishisthpath.jpeg`,
    ],
    label: "Path to chanakya and vashisht",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu4.jpeg`,
    ],
    label: "Manu marg",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya3.jpeg`,
    ],
    label: "chanakya marg",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht4.jpeg`,
    ],
    label: "vashisht marg",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya3.jpeg`,
    ],
    label: "kautalya marg",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/ganga1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/ganga2.jpeg`,
    ],
    label: "ganga 1 sadan",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika4.jpeg`,
    ],
    label: "Ambika sadan",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/gate1path1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/gate1path2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/gate1path3.jpeg`,
      `${process.env.PUBLIC_URL}/assets/vaishnavigate main.jpeg`,
    ],
    label: "path from G1",
    subtitle: "",
  },
  {
    galleryImages: [
      `${process.env.PUBLIC_URL}/assets/Mac/pathmac.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Mac/pathmac1.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Mac/pathmac2.jpeg`,
      `${process.env.PUBLIC_URL}/assets/Mac/pathmac3.jpeg`,
    ],
    label: "path to grocery",
    subtitle: "",
  },
];

const SidePanel = ({ placeData, onClose, onShowDirections }) => {
  const [showGallery, setShowGallery] = useState(false);
  const isNavigatePage = window.location.pathname === "/navigate";

  if (!placeData) return null;

  const normalizeText = (text) => text.toLowerCase().replace(/\s+/g, "");
  const isMatch = (input, label) => {
    const inputNorm = normalizeText(input);
    const labelNorm = normalizeText(label);
    return (
      inputNorm.length > 2 &&
      labelNorm.includes(
        inputNorm.substring(0, Math.ceil(inputNorm.length / 2))
      )
    );
  };

  const foundPlace =
    mappedPlaces.find((p) => isMatch(placeData.placeName, p.label)) ||
    nonMappedPlaces.find((p) => isMatch(placeData.placeName, p.label));

  const hasGallery = foundPlace && foundPlace.galleryImages?.length > 0;

  return (
    <div className="side-panel">
      <div className="image-container">
        {hasGallery ? (
          <img
            src={foundPlace.galleryImages[0]}
            alt={placeData.placeName}
            className="place-image"
          />
        ) : (
          <div className="placeholder-image"></div>
        )}

        <button
          className="gallery-btn"
          disabled={!hasGallery}
          onClick={() => setShowGallery((prev) => !prev)}
          style={{
            opacity: hasGallery ? 1 : 0.5,
            cursor: hasGallery ? "pointer" : "not-allowed",
          }}
        >
          <FaImages size={22} />
        </button>
      </div>

      <h2 className="place-title">{placeData.placeName}</h2>

      <div className="button-container">
        <button className="side-btn" onClick={onShowDirections}>
          <FaDirections size={24} />
          <span>Directions</span>
        </button>
        <button
          className="side-btn"
          onClick={() => shareCoordinates(placeData.coordinates)}
        >
          <FaShareAlt size={24} />
          <span>Share</span>
        </button>
      </div>

      {foundPlace && <div className="place-info">{foundPlace.subtitle}</div>}

      {showGallery && hasGallery && (
        <Gallery
          images={foundPlace.galleryImages}
          onClose={() => setShowGallery(false)}
          position={isNavigatePage ? "right" : "left"}
        />
      )}
    </div>
  );
};

// Function to share location
const shareCoordinates = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    alert("No location selected to share!");
    return;
  }
  const locationLink = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  const whatsappUrl = `https://wa.me/?text=Check out this location: ${encodeURIComponent(
    locationLink
  )}`;
  window.open(whatsappUrl, "_blank");
};

export default SidePanel;
