import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RemedyDetail() {
  const { id } = useParams();
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRemedy = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/remedies/${id}`);
        if (!res.ok) throw new Error('Remedy not found');
        const data = await res.json();
        setRemedy(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRemedy();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!remedy) return <p>No data found.</p>;

  return (
    <div>
      <Link to="/remedies" style={{ display: 'inline-block', marginBottom: '1rem' }}>&larr; Back to Remedies</Link>
      
      <div className="glass" style={{ padding: '2rem' }}>
        <h1 className="detail-title">{remedy.title}</h1>
        
        <div style={{ marginBottom: '1.5rem' }}>
          {remedy.categories?.map(cat => (
            <span key={cat} className="chip">{cat}</span>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <strong>Prep Time:</strong> <p>{remedy.prepTimeMinutes} minutes</p>
          </div>
          <div>
            <strong>Origin:</strong> <p>{remedy.origin}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Ingredients</h2>
          <ul style={{ listStylePosition: 'inside', marginTop: '0.5rem', lineHeight: '1.8' }}>
            {remedy.ingredients?.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <h2>Method</h2>
          <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-line' }}>{remedy.method}</p>
        </div>
      </div>

      <div className="detail-section">
        <h2>Plants Used in this Remedy</h2>
        {remedy.plantIds && remedy.plantIds.length > 0 ? (
          <div className="grid" style={{ marginTop: '1rem' }}>
            {remedy.plantIds.map(plant => (
              <Link to={`/plants/${plant._id}`} key={plant._id} className="card glass">
                <img src={plant.imageUrl || 'https://via.placeholder.com/300'} alt={plant.name} style={{ height: '150px' }} />
                <h3 className="card-title">{plant.name}</h3>
                <p className="card-meta"><em>{plant.scientificName}</em></p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No associated plants linked.</p>
        )}
      </div>
    </div>
  );
}
