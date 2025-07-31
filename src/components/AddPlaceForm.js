import React, { useState } from "react";
import { db } from "../firebase"; // Firebase Firestore config
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./AddPlaceForm.css";

// Cloudinary settings
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpetohjp/upload";
const UPLOAD_PRESET = "places_upload";

const AddPlaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    info: "",
    lat: "",
    lng: "",
    photo360: null,
    photos: [],
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photos") {
      setFormData({ ...formData, photos: Array.from(files) });
    } else if (name === "photo360") {
      setFormData({ ...formData, photo360: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Upload single image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(CLOUDINARY_URL, formData);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.photos.length < 3) {
      return setError("Please upload at least 3 photos.");
    }

    try {
      setUploading(true);
      setError("");

      // Upload optional 360 photo
      let photo360Url = "";
      if (formData.photo360) {
        photo360Url = await uploadToCloudinary(formData.photo360);
      }

      // Upload all photos
      const photoUrls = [];
      for (let photo of formData.photos) {
        const url = await uploadToCloudinary(photo);
        photoUrls.push(url);
      }

      // Save to Firestore
      await addDoc(collection(db, "places"), {
        name: formData.name,
        info: formData.info,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        photo360: photo360Url,
        photos: photoUrls,
      });

      alert("Place added successfully!");
      setFormData({
        name: "",
        info: "",
        lat: "",
        lng: "",
        photo360: null,
        photos: [],
      });
    } catch (err) {
      console.error("Error adding place:", err);
      setError("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-place-form">
      <h2>Add a New Place</h2>

      <input name="name" type="text" placeholder="Place Name" required onChange={handleChange} value={formData.name} />
      <textarea name="info" placeholder="Information" required onChange={handleChange} value={formData.info} />
      <input name="lat" type="number" placeholder="Latitude" step="any" required onChange={handleChange} value={formData.lat} />
      <input name="lng" type="number" placeholder="Longitude" step="any" required onChange={handleChange} value={formData.lng} />

      <label>Upload 3+ Photos (required):</label>
      <input name="photos" type="file" accept="image/*" multiple required onChange={handleChange} />

      <label>Upload 360 Photo (optional):</label>
      <input name="photo360" type="file" accept="image/*" onChange={handleChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Submit Place"}
      </button>
    </form>
  );
};

export default AddPlaceForm;
