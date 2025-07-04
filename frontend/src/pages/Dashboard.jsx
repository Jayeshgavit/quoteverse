import { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my');
  const [profilePic, setProfilePic] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [myQuotes, setMyQuotes] = useState([]);
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({ name: '', email: '' });

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/users/me'); // ✅ fixed path
      setProfilePic(res.data.profilePic || 'https://i.pravatar.cc/100?img=13');
      setUserData({ name: res.data.name, email: res.data.email });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchMyQuotes = async () => {
    try {
      const res = await axios.get('/quotes/my');
      setMyQuotes(res.data);
    } catch (err) {
      console.error('Failed to fetch user quotes', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyQuotes();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setProfilePic(base64Image); // Optimistic UI update

      try {
        await axios.put('/auth/users/profile-pic', { profilePic: base64Image }); // ✅ fixed path
      } catch (err) {
        console.error('Profile update failed', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (quoteId) => {
    const confirmed = window.confirm('Are you sure you want to delete this quote?');
    if (!confirmed) return;

    try {
      await axios.delete(`/quotes/${quoteId}`);
      setMyQuotes((prev) => prev.filter((q) => q._id !== quoteId));
    } catch (err) {
      console.error('Delete failed', err);
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
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong.';
      setMessage(`❌ Upload failed. ${errorMsg}`);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* 🧑 Profile Section */}
      <section className="profile-section">
        {profilePic ? (
          <img src={profilePic} alt="User" className="profile-pic" />
        ) : (
          <div className="profile-pic fallback">🧑</div>
        )}
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
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

      {/* 🌐 Tab Navigation */}
      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('my')}>📜 My Quotes</button>
        <button onClick={() => setActiveTab('saved')}>💾 Saved Quotes</button>
        <button onClick={() => alert("🚧 Discover tab coming soon!")}>🧭 Discover</button>
      </div>

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

      {/* 📃 Quote List */}
      {activeTab === 'my' && (
        <section className="my-quotes-section">
          <h3>📝 Your Shared Quotes</h3>
          {myQuotes.length > 0 ? (
            myQuotes.map((q) => (
              <div key={q._id} className="quote-card">
                <p>“{q.text}”</p>
                <span className="quote-meta">
                  {q.author} | {q.category} | {new Date(q.createdAt).toDateString()}
                </span>
                <button
                  className="delete-quote-btn"
                  onClick={() => handleDelete(q._id)}
                >
                  🗑 Delete
                </button>
              </div>
            ))
          ) : (
            <p>No quotes yet. Share your first one!</p>
          )}
        </section>
      )}

      {activeTab === 'saved' && (
        <section className="my-quotes-section">
          <h3>💾 Saved Quotes (Coming Soon)</h3>
          <p>Saved quotes will be displayed here once developed.</p>
        </section>
      )}
    </div>
  );
}
