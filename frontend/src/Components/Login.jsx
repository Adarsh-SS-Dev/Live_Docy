import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../Components/axiosInstance';
import { AuthContext } from '../Components/AuthContext';
import Navbar from './Navbar';
import './Login.css';               // ⬅️  NEW

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });

      sessionStorage.setItem('token',    res.data.token);
      sessionStorage.setItem('userId',   res.data.user._id);
      sessionStorage.setItem('username', res.data.user.name);

      login(res.data.user.name, res.data.token);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Welcome back</h2>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Login
            </button>
          </form>

          <p className="switch-auth">
            Don’t have an account?{' '}
            <span className="switch-link" onClick={() => navigate('/register')}>
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
