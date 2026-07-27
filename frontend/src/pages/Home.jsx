import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Welcome to HomeRemedis</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Discover traditional medicinal plants and household remedies.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/plants" className="btn" style={{ fontSize: '1.125rem' }}>Browse Plants</Link>
        <Link to="/remedies" className="btn" style={{ fontSize: '1.125rem', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)' }}>Browse Remedies</Link>
      </div>
    </div>
  );
}
