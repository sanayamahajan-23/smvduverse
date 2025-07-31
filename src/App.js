import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SMVDUMap from "./components/SMVDUMap";
import Globe from "./components/Globe";
import NavigationPage from "./pages/NavigationPage";
import NearbyPlaces from "./components/NearbyPlaces";
import WeekendTrips from "./components/WeekendTrips";
import Restaurants from "./components/Restaurants";
import Groceries from "./components/Groceries";
import Medical from "./components/Medical";
import SignIn from "./components/signin";

import Signup from "./components/Signup";             // ✅ NEW
import AdminDashboard from "./components/AdminDashboard"; // ✅ NEW

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/smvdu-map" element={<SMVDUMap />} />
        <Route path="/" element={<Globe />} />
        <Route path="/navigate" element={<NavigationPage user={user} />} />
        <Route path="/nearby" element={<NearbyPlaces />} />
        <Route path="/nearby/attractions" element={<WeekendTrips />} />
        <Route path="/nearby/restaurants" element={<Restaurants />} />
        <Route path="/nearby/groceries" element={<Groceries />} />
        <Route path="/nearby/medical" element={<Medical />} />

        {/* ✅ New Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
