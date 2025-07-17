import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import { ThemeContext } from '../Components/ThemeContext';

const Lognav = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-expand-lg px-3"
      style={{
        width: '100%',
        backgroundColor: 'var(--navbar-bg)',
        color: 'var(--text-color)',
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{ color: 'var(--text-color)' }}>
CollabWrite        </a>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <span className="nav-link" style={{ color: 'var(--text-color)' }}>
                Hello, {user}
              </span>
            </li>
          </ul>

          <ul className="navbar-nav d-flex align-items-center gap-2">
            <li className="nav-item">
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: 'var(--btn-bg)',
                  color: 'var(--btn-text)',
                  border: 'none',
                }}
                onClick={toggleTheme}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: 'var(--btn-bg)',
                  color: 'var(--btn-text)',
                  border: 'none',
                }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Lognav;
