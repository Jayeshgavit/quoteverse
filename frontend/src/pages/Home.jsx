// File: Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Home.css';

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const navigate = useNavigate();

  // ✅ Fetch recent quotes directly from backend
  useEffect(() => {
    fetchRecentQuotes();
  }, []);

  const fetchRecentQuotes = async () => {
    try {
      const res = await axios.get('/quotes/recent'); // ✅ New efficient route
      setQuotes(res.data);
      console.log('✅ Fetched recent quotes:', res.data);
    } catch (err) {
      console.error('❌ Error fetching recent quotes:', err);
    }
  };

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
        <section className="recent-layout">
          <div className="recent-sidebar">📢 Future Ads</div>

          <div className="recent-main">
            <h2>🕑 Recently Added Quotes</h2>
            <div className="recent-quotes-column">
              {quotes.length > 0 ? (
                <>
                  {quotes.map((quote) => (
                    <div className="homepage-quote-card" key={quote._id}>
                      <p>“{quote.text}”</p>
                      <small>
                        — {quote.author} | {quote.category}
                      </small>
                    </div>
                  ))}
                  <button
                    className="view-more-btn"
                    onClick={() => navigate('/quotes')}
                  >
                    🔎 View More Quotes
                  </button>
                </>
              ) : (
                <p>No quotes yet... Be the first to add one! ✨</p>
              )}
            </div>
          </div>

          <div className="recent-sidebar">📰 Announcements</div>
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
