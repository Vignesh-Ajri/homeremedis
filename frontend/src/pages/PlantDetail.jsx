import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PlantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/plants/${id}`);
        if (!res.ok) throw new Error('Plant not found');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!data) return <p>No data found.</p>;

  const { plant, remedies } = data;

  return (
    <div>
      <Link to="/plants" style={{ display: 'inline-block', marginBottom: '1rem' }}>&larr; Back to Plants</Link>
      
      <div className="detail-header glass" style={{ padding: '2rem' }}>
        <img src={plant.imageUrl} alt={plant.name} className="detail-image" />
        <div className="detail-info">
          <h1 className="detail-title">{plant.name}</h1>
          <p className="card-meta" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}><em>{plant.scientificName}</em></p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            <div>
              <strong>Origin:</strong> <p>{plant.countryOfOrigin}</p>
            </div>
            <div>
              <strong>Habitat:</strong> <p>{plant.habitat}</p>
            </div>
            <div>
              <strong>Parts Used:</strong> <p>{plant.partsUsed?.join(', ')}</p>
            </div>
            <div>
              <strong>Active Compounds:</strong> <p>{plant.activeCompounds?.join(', ')}</p>
            </div>
          </div>
          
          <div className="detail-section">
            <h3 style={{ color: '#b45309' }}>Precautions</h3>
            <p>{plant.precautions}</p>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Remedies using {plant.name}</h2>
        {remedies && remedies.length > 0 ? (
          <div className="grid" style={{ marginTop: '1rem' }}>
            {remedies.map(remedy => (
              <Link to={`/remedies/${remedy._id}`} key={remedy._id} className="card glass">
                <h3 className="card-title">{remedy.title}</h3>
                <p className="card-meta">Origin: {remedy.origin}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No remedies listed for this plant.</p>
        )}
      </div>
    </div>
  );
}
