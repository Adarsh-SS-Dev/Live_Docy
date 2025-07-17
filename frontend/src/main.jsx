import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './Components/AuthContext.jsx';
import ThemeProvider from './Components/ThemeContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Contains theme and global styles

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>        {/* ✅ Wrap ThemeProvider outside */}
        <AuthProvider>       {/* ✅ Then AuthProvider */}
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
