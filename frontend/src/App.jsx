import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Remedies from './pages/Remedies';
import RemedyDetail from './pages/RemedyDetail';
import Disclaimer from './components/Disclaimer';
import { Leaf } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar glass">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <Leaf color="var(--primary)" />
            HomeRemedis
          </Link>
          <div className="nav-links">
            <Link to="/plants" className="nav-link">Plants</Link>
            <Link to="/remedies" className="nav-link">Remedies</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Disclaimer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/remedies/:id" element={<RemedyDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
