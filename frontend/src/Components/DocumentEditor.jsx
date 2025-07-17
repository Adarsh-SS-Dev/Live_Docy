import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Components/axiosInstance';
import { io } from 'socket.io-client';
import Lognav from './Lognav';
import './DocumentEditor.css';

const socket = io('http://localhost:5000');

export default function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState({ title: '', content: '' });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const senderId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    socket.on('connect', () => console.log('✅ Connected:', socket.id));
  }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoc(res.data);
        socket.emit('joinDocument', id);
      } catch (err) {
        console.error('❌ Error fetching document:', err);
      }
    };

    fetchDocument();
    socket.on('receiveUpdate', setDoc);
    return () => socket.off('receiveUpdate');
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...doc, [name]: value };
    setDoc(updated);
    socket.emit('documentUpdate', { documentId: id, ...updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/documents/${id}`, doc, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Document saved successfully.');
      navigate('/home');
    } catch (err) {
      console.error('❌ Save failed:', err);
      alert('Failed to save the document.');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('❌ Failed to load messages:', err);
      }
    };

    fetchMessages();
    socket.on('receiveMessage', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off('receiveMessage');
  }, [id, token]);

  const handleSend = () => {
    if (!senderId || !message.trim()) return;
    socket.emit('sendMessage', { documentId: id, message, senderId });
    setMessage('');
  };

  return (
    <div className="editor-page">
      <Lognav />
      <main className="editor-container">
        <section className="editor-pane">
          <h2 className="section-title">📝 Edit Document</h2>
          <form onSubmit={handleSubmit} className="editor-form">
            <input
              name="title"
              value={doc.title}
              onChange={handleChange}
              className="input title-input"
              placeholder="Document Title"
              required
            />
            <textarea
              name="content"
              value={doc.content}
              onChange={handleChange}
              className="input content-input"
              placeholder="Start writing..."
              rows={14}
              required
            />
            <button type="submit" className="btn primary">Save</button>
          </form>
        </section>

        <section className="preview-pane">
            <h3 className="preview-title"></h3>
            <p className="preview-content"></p>

          <div className="chat-block">
            <h2 className="section-title">💬 Chat</h2>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg._id} className="chat-message">
                  <strong className="chat-user">{msg.sender?.name || 'Anonymous'}:</strong>
                  <span className="chat-text"> {msg.message}</span>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="input chat-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn accent" onClick={handleSend}>Send</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
