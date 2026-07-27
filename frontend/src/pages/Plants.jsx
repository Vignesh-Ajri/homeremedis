import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const url = search ? `${API_BASE}/api/plants?search=${encodeURIComponent(search)}` : `${API_BASE}/api/plants`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPlants(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(() => {
      fetchPlants();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Medicinal Plants</h1>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search plants..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {loading && <p>Loading plants...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && plants.length === 0 && (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>No plants found.</p>
        </div>
      )}

      <div className="grid">
        {plants.map(plant => (
          <Link to={`/plants/${plant._id}`} key={plant._id} className="card glass">
            <img src={plant.imageUrl || 'https://via.placeholder.com/300'} alt={plant.name} />
            <div>
              <h3 className="card-title">{plant.name}</h3>
              <p className="card-meta"><em>{plant.scientificName}</em></p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Origin: {plant.countryOfOrigin}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
