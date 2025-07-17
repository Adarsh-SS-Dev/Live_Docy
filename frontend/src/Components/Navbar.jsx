import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          CollabWrite
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">👋 Hello, {user}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create">New</Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Signin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
