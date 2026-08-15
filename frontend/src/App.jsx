import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';

// Lazy-loaded page components — each loads only when the route is visited
const Home = lazy(() => import('./pages/Home'));
const Plants = lazy(() => import('./pages/Plants'));
const PlantDetail = lazy(() => import('./pages/PlantDetail'));
const Remedies = lazy(() => import('./pages/Remedies'));
const RemedyDetail = lazy(() => import('./pages/RemedyDetail'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e7f0e7',
        borderTop: '4px solid #4a7c59',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6b8f71', fontSize: '0.95rem', fontWeight: 500 }}>
        Loading…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-800">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/plants/:id" element={<PlantDetail />} />
              <Route path="/remedies" element={<Remedies />} />
              <Route path="/remedies/:id" element={<RemedyDetail />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
