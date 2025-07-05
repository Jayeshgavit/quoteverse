// File: Dashboard.jsx
import { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import './Dashboard.css';

function QuoteCard({ quote, onDelete }) {
  return (
    <div className="quote-card">
      <p>“{quote.text}”</p>
      <span className="quote-meta">
        {quote.author} | {quote.category} | {new Date(quote.createdAt).toDateString()}
      </span>
      {onDelete && (
        <button className="delete-quote-btn" onClick={() => onDelete(quote._id)}>
          🗑 Delete
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my');
  const [profilePic, setProfilePic] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [myQuotes, setMyQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({ name: '', email: '' });

  const fetchProfile = async () => {
    const res = await axios.get('/auth/users/me');
    setProfilePic(res.data.profilePic || 'https://i.pravatar.cc/100?img=13');
    setUserData({ name: res.data.name, email: res.data.email });
  };

  const fetchMyQuotes = async () => {
    const res = await axios.get('/quotes/my');
    setMyQuotes(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProfile(), fetchMyQuotes()]);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setProfilePic(base64Image);
      await axios.put('/auth/users/profile-pic', { profilePic: base64Image });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this quote?');
    if (!confirmed) return;

    await axios.delete(`/quotes/${id}`);
    setMyQuotes((prev) => prev.filter((q) => q._id !== id));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!quoteText || !author || !category) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    const res = await axios.post('/quotes', { text: quoteText, author, category });
    setMessage('✅ Quote uploaded!');
    setQuoteText('');
    setAuthor('');
    setCategory('');
    setMyQuotes([res.data.quote, ...myQuotes]);
    setTimeout(() => {
      setShowForm(false);
      setMessage('');
    }, 1500);
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="dashboard-wrapper">
      {/* Profile Section */}
      <section className="profile-section">
        {profilePic ? (
          <img src={profilePic} alt="User" className="profile-pic" />
        ) : (
          <div className="profile-pic fallback">🧑</div>
        )}
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
          <button onClick={() => fileInputRef.current.click()} className="update-pic-btn">
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

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('my')}>📜 My Quotes</button>
        <button onClick={() => setActiveTab('saved')}>💾 Saved Quotes</button>
        <button onClick={() => alert('🚧 Discover tab coming soon!')}>🧭 Discover</button>
      </div>

      {/* Toggle Add Form */}
      <section className="add-quote-trigger">
        <button onClick={() => setShowForm(!showForm)} className="toggle-btn">
          {showForm ? 'Cancel' : '➕ Add New Quote'}
        </button>
      </section>

      {/* Add Quote Form */}
      {showForm && (
        <section className="quote-form-container">
          <form className="quote-form" onSubmit={handleQuoteSubmit}>
            <h3>✨ Share Your Quote</h3>
            <textarea
              placeholder="Write your quote here..."
              rows="4"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
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

      {/* My Quotes Section */}
      {activeTab === 'my' && (
        <section className="my-quotes-section">
          <h3>📝 Your Shared Quotes</h3>
          {myQuotes.length > 0 ? (
            myQuotes.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} onDelete={handleDelete} />
            ))
          ) : (
            <p>No quotes yet. Share your first one!</p>
          )}
        </section>
      )}

      {/* Saved Quotes Placeholder */}
      {activeTab === 'saved' && (
        <section className="my-quotes-section">
          <h3>💾 Saved Quotes (Coming Soon)</h3>
          <p>Saved quotes will be displayed here once developed.</p>
        </section>
      )}
    </div>
  );
}