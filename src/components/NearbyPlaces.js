import React from "react";
import { useNavigate } from "react-router-dom";
import "./Nearby.css";

const nearbyItems = [
{
title: "Weekends Trips",
image: `${process.env.PUBLIC_URL}/assets/nearby places/Vaishno_Devi.jpg`,
link: "/nearby/attractions",
description: "Explore must-visit weekend destinations around SMVDU.",
},
{
title: "Restaurants",
image: `${process.env.PUBLIC_URL}/assets/nearby places/sanjeevni.jpeg`,
link: "/nearby/restaurants",
description: "Discover popular places to eat and relax near campus.",
},
{
title: "Medical",
image: `${process.env.PUBLIC_URL}/assets/nearby places/hospital.jpg`,
link: "/nearby/medical",
description: "Find nearby clinics, hospitals, and pharmacies.",
},
{
title: "Stationary / Grocery",
image: `${process.env.PUBLIC_URL}/assets/nearby places/grocery.jpg`,
link: "/nearby/groceries",
description: "All essential shops for your daily needs nearby.",
},
];

const Nearby = () => {
const navigate = useNavigate();

return (
<div className="nearby-container">

<h2 className="nearby-heading">Nearby Places to Visit</h2>
<div className="card-grid">
{nearbyItems.map((item, index) => (
<div
key={index}
className="nearby-card"
onClick={() => navigate(item.link)}
>
<img src={item.image} alt={item.title} className="card-image" />
<div className="card-content">
<h3 className="card-title">{item.title}</h3>
<p className="card-description">{item.description}</p>
</div>
</div>
))}
</div>
</div>
);
};

export default Nearby;

