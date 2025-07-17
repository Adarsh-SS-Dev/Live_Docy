import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import DocumentList from './Components/DocumentList';
import DocumentForm from './Components/DocumentForm';
import DocumentEditor from './Components/DocumentEditor';
import PrivateRoute from './Components/PrivateRoute';
import Home from './Components/Home';

function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<DocumentList />} />
          <Route path="/create" element={<DocumentForm />} />
          <Route path="/edit/:id" element={<DocumentEditor />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
