import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Remedies() {
  const [remedies, setRemedies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const url = selectedCategory ? `${API_BASE}/api/remedies?category=${encodeURIComponent(selectedCategory)}` : `${API_BASE}/api/remedies`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRemedies(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRemedies();
  }, [selectedCategory]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Home Remedies</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <button 
            className={`chip ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Loading remedies...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && remedies.length === 0 && (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>No remedies found.</p>
        </div>
      )}

      <div className="grid">
        {remedies.map(remedy => (
          <Link to={`/remedies/${remedy._id}`} key={remedy._id} className="card glass">
            <div>
              <h3 className="card-title">{remedy.title}</h3>
              <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                {remedy.categories?.map(cat => (
                  <span key={cat} className="chip" style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem' }}>{cat}</span>
                ))}
              </div>
              <p className="card-meta">Prep Time: {remedy.prepTimeMinutes} mins</p>
              <p className="card-meta">Origin: {remedy.origin}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
