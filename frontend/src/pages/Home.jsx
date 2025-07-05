// File: Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Home.css';

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const navigate = useNavigate();

  // ✅ Fetch recent quotes
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
  try {
    const res = await axios.get('/quotes/all'); // ✅ Correct endpoint
    const recent = res.data
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); // 🧠 Only Top 5 Recent
    setQuotes(recent);
    console.log('✅ Fetched recent quotes:', recent);
  } catch (err) {
    console.error('❌ Error fetching recent quotes:', err);
  }
};
  // 📅 Get recent 5
  const recentQuotes = quotes
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ➕ Add Quote handler
  const handleAddQuote = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/dashboard' : '/register');
  };

  return (
    <div className="homepage-container">
      {/* 🎯 Hero Section */}
      <section className="homepage-hero">
        <h1>QuoteVerse ✨</h1>
        <p>Discover, share and save your favorite quotes in one place.</p>
        <button className="homepage-btn" onClick={() => navigate('/quotes')}>
          Explore All Quotes
        </button>
      </section>

      {/* 🧭 Tabs Navigation */}
      <div className="homepage-tabs">
        <button
          className={activeTab === 'recent' ? 'active' : ''}
          onClick={() => setActiveTab('recent')}
        >
          📅 Recent
        </button>
        <button className="disabled" disabled title="Coming soon!">
          🔥 Popular
        </button>
        <button onClick={handleAddQuote}>➕ Add Your Quote</button>
      </div>

      {/* 📃 Quote Display Section */}
      {activeTab === 'recent' && (
        <section className="recent-tab-section">
          <h2>🕑 Recently Added Quotes</h2>
          <div className="homepage-quotes">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((quote) => (
                <div className="homepage-quote-card" key={quote._id}>
                  <p>“{quote.text}”</p>
                  <small>
                    — {quote.author} | {quote.category}
                  </small>
                </div>
              ))
            ) : (
              <p>No quotes yet... Be the first to add one! ✨</p>
            )}
          </div>
        </section>
      )}

      {/* 🌙 Footer */}
      <footer className="homepage-footer">
        <div className="footer-links">
          <span onClick={() => navigate('/')}>Home</span>
          <span onClick={() => navigate('/quotes')}>Quotes</span>
          <span onClick={() => navigate('/dashboard')}>Dashboard</span>
        </div>
        <p>
          © {new Date().getFullYear()} QuoteVerse | Built with 💚 by{' '}
          <strong>Jayesh</strong>
        </p>
      </footer>
    </div>
  );
}
