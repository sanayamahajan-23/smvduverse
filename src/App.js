import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SMVDUMap from "./components/SMVDUMap";
import Globe from "./components/Globe";
import MapView from "./components/MapView";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/smvdu-map" element={<SMVDUMap />} />
        <Route path="/" element={<Globe />} />
        <Route path="/navigate" element={<MapView />} />
      </Routes>
    </Router>
  );
}

export default App;
