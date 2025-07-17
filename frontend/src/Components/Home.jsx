import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-title">
          Welcome to <span className="brand">CollabWrite</span>
        </h1>
        <h2 className="home-tagline">Real-time syncing & document editing</h2>
        <p className="home-description">
          Create, edit, and share documents instantly. Multiple users work together
          live, see updates in real‑time, and collaborate seamlessly—perfect for
          drafting reports, taking meeting notes, or building ideas together.
        </p>

        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </section>
    </div>
  );
}
