// =============================
// 6. frontend/src/pages/Dashboard.jsx
// =============================

import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const [profilePic, setProfilePic] = useState('https://i.pravatar.cc/100?img=13');
  const [showForm, setShowForm] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [quotes, setQuotes] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchMyQuotes() {
      try {
        const res = await axios.get('/quotes/my');
        setQuotes(res.data);
      } catch (err) {
        console.error("Failed to fetch user quotes", err);
      }
    }
    fetchMyQuotes();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuoteSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  if (!quoteText || !author || !category) {
    setMessage('❌ Please fill in all fields.');
    return;
  }

  try {
    const res = await axios.post('/quotes', {
      text: quoteText,
      author,
      category,
    });

    setMessage('✅ Quote uploaded successfully!');
    setQuoteText('');
    setAuthor('');
    setCategory('');
    setQuotes([res.data.quote, ...quotes]);

    // 🎉 Close the form after 1.5 seconds
    setTimeout(() => {
      setShowForm(false);
      setMessage('');
    }, 1500);
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Something went wrong.';
    setMessage(`❌ Upload failed. ${errorMsg}`);
  }
};


  return (
    <div className="dashboard-wrapper">
      {/* 🧑 Profile Section */}
      <section className="profile-section">
        <img src={profilePic} alt="User" className="profile-pic" />
        <div className="profile-info">
          <h2>Jayesh</h2>
          <p>jayesh@example.com</p>
          <button
            className="update-pic-btn"
            onClick={() => fileInputRef.current.click()}
          >
            📸 Update Profile Picture
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
      </section>

      {/* ➕ Add Quote Toggle */}
      <section className="add-quote-trigger">
        <button onClick={() => setShowForm(!showForm)} className="toggle-btn">
          {showForm ? 'Cancel' : '➕ Add New Quote'}
        </button>
      </section>

      {/* 📝 Add Quote Form */}
      {showForm && (
        <section className="quote-form-container">
          <form className="quote-form" onSubmit={handleQuoteSubmit}>
            <h3>✨ Share Your Quote</h3>

            <textarea
              placeholder="Write your quote here..."
              rows="4"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Choose Category</option>
              <option value="Life">🌱 Life</option>
              <option value="Love">❤️ Love</option>
              <option value="Motivation">🔥 Motivation</option>
              <option value="Success">🏆 Success</option>
              <option value="Wisdom">🧠 Wisdom</option>
              <option value="Friendship">🤝 Friendship</option>
              <option value="Humor">😄 Humor</option>
            </select>

            <button type="submit">Post Quote</button>
            {message && <p className="quote-message">{message}</p>}
          </form>
        </section>
      )}

      {/* 📃 Quote List */}
      <section className="my-quotes-section">
        <h3>📝 Your Shared Quotes</h3>
        {quotes.map((q) => (
          <div key={q._id} className="quote-card">
            <p>“{q.text}”</p>
            <span className="quote-meta">
              {q.author} | {q.category} | {new Date(q.createdAt).toDateString()}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}