import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Remedies from './pages/Remedies';
import RemedyDetail from './pages/RemedyDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-800">     
        <Navbar />
        <main className="flex-1">
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
