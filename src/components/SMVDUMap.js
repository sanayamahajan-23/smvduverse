import React, { useState, useEffect, useRef } from "react";
import "./CloudTransition.css";
import "./SMVDUMap.css";
import Hotspot from "./Hotspot";
import PhotoSphere from "./PhotoSphereViewer";
const SMVDUMap = () => {
  const [currentHotspotIndex, setCurrentHotspotIndex] = useState(-1);
  const [isCloudVisible, setIsCloudVisible] = useState(true);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);
  const [figurinePosition, setFigurinePosition] = useState({ x: 20, y: 300 });
  const [isFigurineDragging, setIsFigurineDragging] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const hotspots = [
    {
      id: 1,
      x: 840,
      y: 430,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Gate/gate1.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Gate/gate1pic.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Gate/gate2pic.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Gate/gate3pic.jpeg`,
      ],
      label: "Gate 1",
      subtitle:
        "Main entrance to the campus, welcoming visitors and providing access to the academic and residential areas of the university.",
      linkedHotspots: [
        { id: "p", latitude: 10, longitude: 0, label: "Entering SMVDU" },
      ],
    },
    {
      id: 2,
      x: 1100,
      y: 390,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manumarg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu4.jpeg`,
      ],
      label: "Residential Area",
      subtitle:
        "This area is designated for the accommodation of staff members, providing comfortable living spaces with essential amenities for faculty and employees.",
      linkedHotspots: [
        //{ id: "p", latitude: 30, longitude: 10 },
        { id: "c", latitude: 10, longitude: 0, label: "Exit" },
      ],
    },
    {
      id: 3,
      x: 1070,
      y: 360,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Park/park3.jpeg`,
      ],
      label: "Guest House Park",
      subtitle:
        "A peaceful outdoor park area located near the guest house, offering a relaxing environment with greenery and seating spaces, ideal for leisure and casual gatherings.",
      linkedHotspots: [
        { id: 4, latitude: 10, longitude: 250, label: "Guest House" },
      ],
    },
    {
      id: 4,
      x: 1030,
      y: 380,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse.jpeg`,
      galleryImages: [
        // `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/Guesthouse1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/GuestHouse/guesthouse4.jpeg`,
      ],
      label: "Guest House",
      subtitle:
        "A comfortable stay for visitors and guests, offering a serene environment with all essential amenities for a restful visit.",
      linkedHotspots: [
        { id: 3, latitude: 10, longitude: 130, label: "Guest House Park" },
        { id: "c", latitude: 10, longitude: -60, label: "Exit" },
      ],
    },
    {
      id: 5,
      x: 980,
      y: 450,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Vaishnavi/vaishnavi.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Vaishnavi/Vaishnavi-5.jpeg`,
      ],
      label: "Vaishnavi",
      subtitle:
        "Welcome to Vaishnavi, the oldest and one of the most iconic girls' hostels on campus.Its historical significance and close-knit community make it a beloved place on campus, where friendships are formed and memories are made.",
      linkedHotspots: [{ id: "a", latitude: 10, longitude: 0, label: "Exit" }],
    },
    {
      id: 6,
      x: 925,
      y: 290,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Grocery",
      subtitle:
        "A convenient on-campus grocery store offering a wide range of essential items, snacks, and daily necessities for students and faculty, ensuring easy access to everyday products.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 7,
      x: 910,
      y: 305,
      imageUrl: `${process.env.PUBLIC_URL}/assets/Mac/mac.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Mac/mac1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Mac/mac2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Mac/mac3.jpeg`,
      ],
      label: "Medical Aid Center",
      subtitle:
        "The Medical Aid Center provides immediate healthcare services and first-aid assistance to students and staff.",
      linkedHotspots: [
        { id: "q", latitude: -5, longitude: 140, label: "exit" },
        // { id: "q", latitude: 5, longitude: 45, label: "Exit" },
      ],
    },
    {
      id: 8,
      x: 910,
      y: 245,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Shivalik A",
      subtitle:
        "Shivalik A is a modern girls' hostel offering a secure and comfortable environment with essential amenities for students.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 9,
      x: 910,
      y: 180,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Shivalik B",
      subtitle:
        "A newly established girls' hostel, offering comfortable and secure accommodations for female students.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 10,
      x: 1050,
      y: 80,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Helipad",
      subtitle:
        "An essential facility for emergency evacuations and official visits, providing swift aerial access to the campus.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 11,
      x: 810,
      y: 110,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Tennis Court",
      subtitle:
        "A well-maintained tennis court offering a great space for sports enthusiasts and students to enjoy recreational activities.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 12,
      x: 790,
      y: 60,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Workshop",
      subtitle:
        "The Mechanical Workshop is renowned for its state-of-the-art machines and equipment, making it the best in Jammu's colleges.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 13,
      x: 630,
      y: 20,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "School Of Architecture & Design",
      subtitle:
        "The School of Architecture & Design offers innovative programs in architecture and design, fostering creativity and technical skills.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 14,
      x: 540,
      y: 40,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Parking",
      subtitle:
        "The parking area is designated for SMVDU buses and visitors, providing convenient parking space for transportation and guests.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 15,
      x: 550,
      y: 130,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Matrika",
      subtitle:
        "Matrika is a large auditorium used for lectures, events, and conferences, hosting various academic and cultural activities.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 16,
      x: 610,
      y: 170,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Administrative Block",
      subtitle:
        "The Administrative Block houses various offices including student services, faculty administration, and management offices.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 17,
      x: 640,
      y: 242,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Fountain Area",
      subtitle:
        "A peaceful and scenic spot featuring a beautiful fountain, perfect for relaxation and reflection amidst nature's tranquility.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 18,
      x: 720,
      y: 150,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "J&K Bank",
      subtitle:
        "The J&K Bank branch located at the main entrance to the campus offers various banking services for students, staff, and visitors.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 19,
      x: 745,
      y: 155,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Block D",
      subtitle:
        "Block D houses the Mathematics Department and several Computer Science Engineering (CSE) laboratories, providing essential facilities for research and learning in these disciplines.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 20,
      x: 755,
      y: 195,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Block C",
      subtitle:
        "Block C is home to the departments of Electronics Engineering, Electrical Engineering, and Economics. It serves as a key academic block within the campus, offering advanced learning in these fields.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 21,
      x: 775,
      y: 225,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "BC Junction/TBIC",
      subtitle:
        "BC Junction serves as the main entrance to the campus. It houses the Technology Business Incubator Centre (TBIC) above it, fostering innovation and entrepreneurship. The junction also includes an ATM for convenience.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 22,
      x: 755,
      y: 265,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Block B",
      subtitle:
        "Block B is dedicated to the Mechanical Engineering Department and the Energy Management program. It provides state-of-the-art facilities in mechanical systems and sustainable energy solutions.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 23,
      x: 750,
      y: 300,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Block A",
      subtitle:
        "Block A houses the Biotechnology Department and Physics classrooms. It is a space where students and faculty collaborate on innovative projects, fostering a deep understanding of science and technology.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 24,
      x: 710,
      y: 305,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "LT1/2",
      subtitle:
        "Lecture halls designed to accommodate large classes, equipped with modern amenities for interactive learning and seminars.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 25,
      x: 700,
      y: 240,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "School of Language/Philosophy",
      subtitle:
        "A hub for critical thinking and the study of languages, literature, and philosophy, fostering a deep understanding of culture and thought.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 26,
      x: 700,
      y: 210,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "School of Business Management",
      subtitle:
        "A center of excellence that offers cutting-edge business education, preparing students for leadership roles in the global market.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 27,
      x: 700,
      y: 150,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "LT3/4",
      subtitle:
        "Lecture halls designed for large classes, equipped with modern teaching aids and interactive learning facilities.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 28,
      x: 660,
      y: 160,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "School of Computer Science",
      subtitle:
        "An academic center for computer science education and research, equipped with modern labs and a collaborative learning environment.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 29,
      x: 680,
      y: 300,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Research Block",
      subtitle:
        "A hub for academic research and innovation, providing state-of-the-art facilities and collaborative spaces for students and faculty.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 30,
      x: 620,
      y: 310,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photo1.png`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.png`,
        `${process.env.PUBLIC_URL}/assets/photo1.png`,
      ],
      label: "Central Library",
      subtitle:
        "A hub of knowledge and learning, the Central Library offers a peaceful environment for studying and research, with a vast collection of resources.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 31,
      x: 595,
      y: 242,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Red Rocks",
      subtitle:
        "The Red Rocks are a popular spot where students gather to relax, enjoy the view, and socialize, offering a vibrant atmosphere with its distinctive red stairs.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 32,
      x: 400,
      y: 247,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Central Gym/Mess",
      subtitle:
        "The Central Gym/Mess serves as the hub for fitness and dining, providing students with state-of-the-art workout facilities and nutritious meals to support their physical and academic well-being.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 33,
      x: 439,
      y: 270,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Kailash",
      subtitle:
        "Kailash is a boys' hostel offering a comfortable and convenient stay with all necessary amenities to support student life and learning.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 34,
      x: 435,
      y: 225,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Trikuta",
      subtitle:
        "Trikuta is another well-equipped boys' hostel, providing a supportive environment for students with modern facilities and a lively atmosphere.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 35,
      x: 350,
      y: 190,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Vindhyachal",
      subtitle:
        "Vindhyachal is yet another boys' hostel, known for its vibrant community, comfortable living spaces, and amenities that cater to both academic focus and leisure activities.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 36,
      x: 359,
      y: 323,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Nilgiri",
      subtitle:
        "Nilgiri serves as another boys' hostel on campus, offering a peaceful environment with spacious rooms, modern facilities, and a vibrant atmosphere that supports both academic and social activities.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 37,
      x: 300,
      y: 390,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere2.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "New Basholi",
      subtitle:
        "New Basholi is a newly built boys' hostel with modern facilities, offering spacious rooms, a recreation area, and a comfortable living environment for students.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 38,
      x: 90,
      y: 280,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photosphere1.jpg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.jpg`,
        `${process.env.PUBLIC_URL}/assets/photo2.jpg`,
      ],
      label: "Sports Complex",
      subtitle:
        "The Sports Complex serves as a hub for a variety of athletic activities. It is equipped with modern facilities. This area is a popular gathering spot for fitness enthusiasts, offering a space to engage in physical activity or simply relax and unwind.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
    {
      id: 39,
      x: 120,
      y: 570,
      imageUrl: `${process.env.PUBLIC_URL}/assets/photo1.png`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/photo1.png`,
        `${process.env.PUBLIC_URL}/assets/photo1.png`,
      ],
      label: "Gate 2",
      subtitle:
        "This is the second entry point to the premises. It is designated exclusively for pedestrian use, and no vehicles are permitted to pass through this gate at any time.",
      linkedHotspots: [{ id: "a", latitude: 30, longitude: 45 }],
    },
  ];
  const nonMappedHotspots = [
    {
      id: "a",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/routeto2pathsfromvaishnavi.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/outsidevaishnavi1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/outsidevaishnavi2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/outsidevaishnavi3.jpeg`,
      ],
      label: "outside vaishnavi",
      subtitle: "",
      linkedHotspots: [
        {
          id: "b",
          latitude: 10,
          longitude: 0,
          label: "Towards G1/Grocery/Medical Aid Centre/Departments",
        },
        {
          id: "c",
          latitude: 10,
          longitude: 140,
          label: "Towards Guesthouse/Margs",
        },
        { id: "d", latitude: 5, longitude: 210, label: "Towards Parking" },
        { id: 5, latitude: 0, longitude: -10, label: "Vaishnavi" },
      ],
    },
    {
      id: "b",
      imageUrl: `${process.env.PUBLIC_URL}/assets/vaishnavigate.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/vaishnavimaingate1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/vaishnavimaingate2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/vaishnavimaingate3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/vaishnavigate main.jpeg`,
      ],
      label: "Entrance of hostel,guest house and residential area",
      subtitle: "",
      linkedHotspots: [
        // { id: 1, position: { x: 10, y: 20, z: 0 } },
        {
          id: "a",
          latitude: 10,
          longitude: 90,
          label: "Towards Vaishnavi/Guesthouse/Parking",
        },
        { id: "p", latitude: 10, longitude: 270, label: "back to G1" },
      ],
    },
    {
      id: "c",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/routetoguest,marg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/guestpath.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/manumargpath.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathtomanu.jpeg`,
      ],
      label: "path to guest house or margs",
      subtitle: "",
      linkedHotspots: [
        { id: 4, latitude: 10, longitude: 80, label: "Guesthouse" },
        {
          id: "a",
          latitude: 10,
          longitude: 0,
          label: "Towards Vaishnavi/Parking",
        },
        {
          id: "i",
          latitude: 10,
          longitude: 180,
          label: "Towards Chanakya/Vashisth Marg",
        },
        { id: "j", latitude: 10, longitude: 230, label: "Manu Marg" },
      ],
    },
    {
      id: "d",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/gate2vaishnavi.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/parking1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/parking2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/path2fromvaishnavi2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/path2fromvaishnavi3.jpeg`,
      ],
      label: "Path 2 from vaishnavi",
      subtitle: "",
      linkedHotspots: [
        {
          id: "a",
          latitude: 10,
          longitude: 185,
          label: "Towards Vaishnavi/Margs/Guesthouse",
        },
        { id: "e", latitude: 10, longitude: 0, label: "Towards Ambika Sadan" },
      ],
    },
    {
      id: "e",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/pathAmbikasadan.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathambika3.jpeg`,
      ],
      label: "Path of Ambika sadan",
      subtitle: "",
      linkedHotspots: [
        { id: "d", latitude: 10, longitude: 190, label: "Towards Parking" },
        { id: "f", latitude: 10, longitude: 0, label: "Towards Durga Sadan" },
        { id: "o", latitude: 10, longitude: 60, label: "Ambika Sadan" },
      ],
    },
    {
      id: "f",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/durgasadanpath.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathdurga3.jpeg`,
      ],
      label: "path of durga sadan",
      subtitle: "",
      linkedHotspots: [
        {
          id: "e",
          latitude: 10,
          longitude: 185,
          label: "Towards Ambika Sadan",
        },
        { id: "g", latitude: 10, longitude: 0, label: "Towards other Margs" },
      ],
    },
    {
      id: "g",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/path to sadan.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathganga1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathganga.jpeg`,
      ],
      label: "Path to sadan",
      subtitle: "",
      linkedHotspots: [
        {
          id: "f",
          latitude: 10,
          longitude: 185,
          label: "Towards Durga Sadan",
        },
        {
          id: "h",
          latitude: 10,
          longitude: 0,
          label: "Towards GangaI Sadan and Kautalya Marg",
        },
      ],
    },
    {
      id: "h",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/pathtoganga,kautalya.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya4.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/pathgangaandkautalya5.jpeg`,
      ],
      label: "Path to ganga and kautalya",
      subtitle: "",
      linkedHotspots: [
        {
          id: "i",
          latitude: 10,
          longitude: 10,
          label: "Towards Chanakya and Vashisth Marg",
        },
        {
          id: "g",
          latitude: 10,
          longitude: 180,
          label: "Path to other Sadans",
        },
        { id: "m", latitude: 10, longitude: 120, label: "Kautalya Marg" },
        { id: "n", latitude: 10, longitude: 280, label: "Ganga I Sadan" },
      ],
    },
    {
      id: "i",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Path/pathtovishishtandchanakya.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/chanakyapath.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/chanakyapath2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/vishisthpath.jpeg`,
      ],
      label: "Path to chanakya and vashisht",
      subtitle: "",
      linkedHotspots: [
        {
          id: "h",
          latitude: 10,
          longitude: 10,
          label: "Towards Ganga Sadan/Kautalya Marg",
        },
        {
          id: "c",
          latitude: 10,
          longitude: 180,
          label: "Towards Guesthouse/Manu Marg",
        },
        { id: "l", latitude: 10, longitude: 90, label: "Vashisth Marg" },
        { id: "k", latitude: 0, longitude: -10, label: "Chanakya Marg" },
      ],
    },
    {
      id: "j",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manumarg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/manu4.jpeg`,
      ],
      label: "Manu marg",
      subtitle: "",
      linkedHotspots: [{ id: "c", latitude: 10, longitude: 0, label: "Exit" }],
    },
    {
      id: "k",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakayamarg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/chanakaya3.jpeg`,
      ],
      label: "chanakya marg",
      subtitle: "",
      linkedHotspots: [
        { id: "i", latitude: 10, longitude: 180, label: "Exit" },
      ],
    },
    {
      id: "l",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashishtmarg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/vashisht4.jpeg`,
      ],
      label: "vashisht marg",
      subtitle: "",
      linkedHotspots: [{ id: "i", latitude: 10, longitude: 0, label: "Exit" }],
    },
    {
      id: "m",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalyamarg.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/kautalya3.jpeg`,
      ],
      label: "kautalya marg",
      subtitle: "",
      linkedHotspots: [
        { id: "h", latitude: 10, longitude: 260, label: "Exit" },
      ],
    },
    {
      id: "n",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/gangasadan.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/ganga1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Margs/ganga2.jpeg`,
      ],
      label: "ganga 1 sadan",
      subtitle: "",
      linkedHotspots: [
        { id: "h", latitude: 10, longitude: 180, label: "Exit" },
      ],
    },
    {
      id: "o",
      imageUrl: `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambikasadan.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Residential Area/Sadan/ambika4.jpeg`,
      ],
      label: "Ambika sadan",
      subtitle: "",
      linkedHotspots: [
        { id: "e", latitude: 10, longitude: 290, label: "Exit " },
      ],
    },
    {
      id: "p",
      imageUrl: `${process.env.PUBLIC_URL}/assets/pathfromg1.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/gate1path1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/gate1path2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/gate1path3.jpeg`,
        `${process.env.PUBLIC_URL}/assets/vaishnavigate main.jpeg`,
      ],
      label: "path from G1",
      subtitle: "",
      linkedHotspots: [
        {
          id: "q",
          latitude: 10,
          longitude: 350,
          label: "Towards Grocery/Medical Aid Centre/Departments",
        },
        { id: "b", latitude: 10, longitude: 70, label: "Towards Vaishnavi" },
      ],
    },
    {
      id: "q",
      imageUrl: `${process.env.PUBLIC_URL}/assets/pathtogrocery,mac,departments.jpeg`,
      galleryImages: [
        `${process.env.PUBLIC_URL}/assets/Mac/pathmac.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Mac/pathmac1.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Mac/pathmac2.jpeg`,
        `${process.env.PUBLIC_URL}/assets/Mac/pathmac3.jpeg`,
      ],
      label: "path to grocery",
      subtitle: "",
      linkedHotspots: [
        // { id: "e", latitude: 10, longitude: 290 },
        // { id: "e", latitude: 10, longitude: 290 },
        {
          id: 7,
          latitude: 4,
          longitude: 150,
          label: "way to medical aid center",
        },
        {
          id: "p",
          latitude: 10,
          longitude: 180,
          label: "path to G1, vaishnavi",
        },
      ],
    },
  ];
  const handleHotspotClick = (index) => {
    setCurrentHotspotIndex(index);
    setSelectedPhoto(hotspots[index].imageUrl); // Set the selected image
    setSelectedGalleryImages(hotspots[index].galleryImages); // Set gallery images
  };

  const closePhotoSphere = () => {
    setSelectedPhoto(null);
    setSelectedGalleryImages([]);
  };
  useEffect(() => {
    const mapImage = new Image();
    const cloudImage = new Image();

    mapImage.src = `${process.env.PUBLIC_URL}/assets/smvdu.jpg`;
    cloudImage.src = `${process.env.PUBLIC_URL}/assets/cloud.png`;
    Promise.all([
      new Promise((resolve) => {
        mapImage.onload = resolve;
      }),
      new Promise((resolve) => {
        cloudImage.onload = resolve;
      }),
    ]).then(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setShouldReveal(true);
      }, 1000);
      setTimeout(() => {
        setIsCloudVisible(false);
      }, 5000);
    });
  }, []);
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 200));
  };
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1));
  };
  const handleRefresh = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };
  const handleMouseUp = () => {
    setDragging(false);
    setIsFigurineDragging(false);
  };
  const handleMouseLeave = () => {
    setDragging(false);
    setIsFigurineDragging(false);
  };

  const handleFigurineMouseDown = (e) => {
    e.stopPropagation();
    setIsFigurineDragging(true);
    setStartPosition({
      x: e.clientX - figurinePosition.x,
      y: e.clientY - figurinePosition.y,
    });
  };

  useEffect(() => {
    if (isFigurineDragging) {
      window.addEventListener("mousemove", handleFigurineMouseMove);
      window.addEventListener("mouseup", handleFigurineMouseUp);
    } else {
      window.removeEventListener("mousemove", handleFigurineMouseMove);
      window.removeEventListener("mouseup", handleFigurineMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleFigurineMouseMove);
      window.removeEventListener("mouseup", handleFigurineMouseUp);
    };
  }, [isFigurineDragging]);

  const handleFigurineMouseMove = (e) => {
    if (!isFigurineDragging) return;

    const newPosition = {
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    };

    setFigurinePosition(newPosition);

    // Check if figurine overlaps with any hotspot
    let closestHotspot = null;

    hotspots.forEach((hotspot, index) => {
      const hotspotLeft = hotspot.x * scale + position.x;
      const hotspotTop = hotspot.y * scale + position.y;
      const hotspotRight = hotspotLeft + 30; // Adjust width for accurate hitbox
      const hotspotBottom = hotspotTop + 30; // Adjust height for accurate hitbox

      // Check if figurine is inside the hotspot's bounds
      if (
        newPosition.x + 40 >= hotspotLeft && // Consider figurine width (40px in this case)
        newPosition.x <= hotspotRight &&
        newPosition.y + 70 >= hotspotTop && // Consider figurine height (70px in this case)
        newPosition.y <= hotspotBottom
      ) {
        closestHotspot = { ...hotspot, index }; // Include the index of the hotspot
      }
    });

    // Set the hovered hotspot
    setHoveredHotspot(closestHotspot);
  };

  const handleFigurineMouseUp = () => {
    setIsFigurineDragging(false);

    // Remove event listeners when drag ends
    window.removeEventListener("mousemove", handleFigurineMouseMove);
    window.removeEventListener("mouseup", handleFigurineMouseUp);

    if (hoveredHotspot) {
      // Use a slight delay to simulate 1ms logic
      setTimeout(() => {
        handleHotspotClick(hoveredHotspot.index); // Trigger the 360° view
      }, 1);
    }
  };

  // Search and suggestion logic
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.length > 0) {
      const filteredSuggestions = hotspots.filter((hotspot) =>
        hotspot.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (hotspot) => {
    const zoomLevel = 3; // Increased zoom level

    // Calculate new position to center the hotspot on the screen
    const newPosX = -hotspot.x * zoomLevel + mapRef.current.offsetWidth / 2;
    const newPosY = -hotspot.y * zoomLevel + mapRef.current.offsetHeight / 2;

    // Ensure the position doesn't go out of bounds when zoomed in
    const boundedX = Math.max(
      Math.min(newPosX, 0),
      -mapRef.current.offsetWidth * zoomLevel + window.innerWidth
    );
    const boundedY = Math.max(
      Math.min(newPosY, 0),
      -mapRef.current.offsetHeight * zoomLevel + window.innerHeight
    );

    // Set the new position and zoom level
    setPosition({ x: boundedX, y: boundedY });
    setScale(zoomLevel); // Apply the increased zoom level
    setSearchText(hotspot.label);
    setSuggestions([]); // Clear suggestions
  };

  const cloudStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/cloud.png)`,
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      {isLoaded &&
        !selectedPhoto && ( // Only show the map if no photo sphere is selected
          <div
            className="zoom-container"
            ref={mapRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: dragging ? "grabbing" : "grab",
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/smvdu.jpg`}
              alt="SMVDU Landscape"
              style={{
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
                objectFit: "cover",
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
            {hotspots.map((hotspot, index) => (
              <Hotspot
                key={index}
                x={hotspot.x}
                y={hotspot.y}
                onClick={() => handleHotspotClick(index)}
                label={hotspot.label}
                scale={scale}
                position={position}
              />
            ))}
          </div>
        )}
      {!selectedPhoto && (
        <div
          className="search-container"
          style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1 }}
        >
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search for a location..."
            style={{ padding: "8px", width: "200px" }}
          />
          {suggestions.length > 0 && (
            <div
              className="suggestions-box"
              style={{ backgroundColor: "white", padding: "10px" }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ cursor: "pointer", padding: "5px 0" }}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show the Photo Sphere when a photo is selected */}
      {selectedPhoto && (
        <PhotoSphere
          imageUrl={selectedPhoto}
          additionalImages={selectedGalleryImages}
          hotspots={hotspots}
          currentHotspotIndex={currentHotspotIndex}
          setCurrentHotspotIndex={setCurrentHotspotIndex}
          nonMappedHotspots={nonMappedHotspots}
          onClose={closePhotoSphere}
        />
      )}

      {/* Conditionally render zoom controls and figurine */}
      {!selectedPhoto && isLoaded && (
        <>
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomIn}>
              +
            </button>
            <button className="zoom-button" onClick={handleRefresh}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/reload.png`}
                alt="Refresh"
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <button className="zoom-button" onClick={handleZoomOut}>
              -
            </button>
          </div>

          <div
            className="figurine"
            style={{
              position: "absolute",
              left: `${figurinePosition.x}px`,
              top: `${figurinePosition.y}px`,
              zIndex: 1000,
              cursor: "pointer",
              width: "40px",
              height: "70px",
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/figurine.png)`,
              backgroundSize: "cover",
              border: hoveredHotspot ? "2px solid yellow" : "none",
            }}
            onMouseDown={handleFigurineMouseDown}
            onMouseMove={handleFigurineMouseMove}
            onMouseUp={handleFigurineMouseUp}
          />
        </>
      )}

      {/* Cloud transition */}
      {isCloudVisible && isLoaded && (
        <>
          <div
            className={`cloud cloud-left ${shouldReveal ? "reveal-left" : ""}`}
            style={{ ...cloudStyle }}
          />
          <div
            className={`cloud cloud-right ${
              shouldReveal ? "reveal-right" : ""
            }`}
            style={{ ...cloudStyle }}
          />
          <div
            className={`cloud cloud-right1 ${
              shouldReveal ? "reveal-right" : ""
            }`}
            style={{ ...cloudStyle }}
          />
          <div
            className={`cloud cloud-right1 ${
              shouldReveal ? "reveal-right" : ""
            }`}
            style={{ ...cloudStyle }}
          />
        </>
      )}
    </div>
  );
};

export default SMVDUMap;
