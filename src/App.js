import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SMVDUMap from "./components/SMVDUMap";
import Globe from "./components/Globe";
import Navigation from "./components/Navigation";
import NearbyPlaces from "./components/NearbyPlaces";
import WeekendTrips from "./components/WeekendTrips"
import Restaurants from "./components/Restaurants"
import Groceries from "./components/Groceries"
import Medical from "./components/Medical"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/smvdu-map" element={<SMVDUMap />} />
        <Route path="/" element={<Globe />} />
        <Route path="/navigate" element={<Navigation />} />
        <Route path="/nearby" element={<NearbyPlaces />} />
        <Route path="/nearby/attractions" element={<WeekendTrips />} />
        <Route path="/nearby/restaurants" element={<Restaurants />} />
        <Route path="/nearby/groceries" element={<Groceries />} />
        <Route path="/nearby/medical" element={<Medical />} />
      </Routes>
    </Router>
  );
}

export default App;
