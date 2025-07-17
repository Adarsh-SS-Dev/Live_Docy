import React, { useState } from 'react';
import axios from '../Components/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './DocumentForm.css'; // 🆕 Add this CSS file
import Lognav from './Lognav';

const DocumentForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/documents', { title, content });
      navigate('/home');
    } catch (err) {
      alert('Create failed');
    }
  };

  return (
    <div className="form-page">
      <Lognav />
      <div className="form-container">
        <div className="form-card">
          <h2>Create a New Document</h2>
          <form onSubmit={handleSubmit} className="form-fields">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="form-textarea"
            />
            <button type="submit" className="btn-submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
