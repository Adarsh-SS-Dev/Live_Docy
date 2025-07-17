import React, { useEffect, useState } from 'react';
import axios from '../Components/axiosInstance';
import { Link } from 'react-router-dom';
import './DocumentList.css';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const token = sessionStorage.getItem('token');

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('❌ Failed to load documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Document deleted successfully');
      fetchDocuments();
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="document-page">
      <div className="document-container">
        <div className="document-header">
          <h2>Your Documents</h2>
          <Link to="/create" className="btn-create">+ New Document</Link>
        </div>

        <div className="document-list">
          {documents.length > 0 ? (
            documents.map(doc => (
              <div className="document-card" key={doc._id}>
                <h3>{doc.title}</h3>
                <div className="doc-actions">
                  <Link to={`/edit/${doc._id}`} className="btn-edit">Edit</Link>
                  <button className="btn-delete" onClick={() => handleDelete(doc._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No documents yet. Create your first one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
