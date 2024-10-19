import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SMVDUMap from './components/SMVDUMap';
import Globe from './components/Globe';

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/smvdu-map" element={<SMVDUMap />} />
        <Route path="/" element={<Globe />} />
      </Routes>
    </Router>
  );
}

export default App;

