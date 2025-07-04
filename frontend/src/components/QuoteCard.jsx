import React, { useState } from 'react';
import './QuoteCard.css';

export default function QuoteCard({ quote, userId }) {
  const [liked, setLiked] = useState(quote.likedBy?.includes(userId));
  const [likeCount, setLikeCount] = useState(quote.likes || 0);
  const [saved, setSaved] = useState(quote.savedBy?.includes(userId));
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // ❤️ Like/Unlike handler
  const handleLike = async () => {
    if (!isLoggedIn) return alert('🔒 Please login to like quotes.');

    try {
      const res = await fetch(`http://localhost:2200/api/quotes/${quote._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likes);
        setLiked(!liked);
      } else {
        alert('❌ Failed to like quote.');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // 📌 Save/Unsave handler
  const handleSave = async () => {
    if (!isLoggedIn) return alert('🔐 Please login to save quotes.');

    try {
      const res = await fetch(`http://localhost:2200/api/quotes/${quote._id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      } else {
        alert('❌ Failed to save quote.');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // 📋 Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="quote-card">
      <p className="quote-text">“{quote.text}”</p>

      <div className="quote-meta">
        <span>{quote.author}</span>
        <span>• {quote.category}</span>
        <span>• {new Date(quote.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="quote-actions">
        <button
          onClick={handleLike}
          className={`quote-btn ${liked ? 'active liked' : ''}`}
        >
          {liked ? `❤️ ${likeCount}` : `🤍 Like (${likeCount})`}
        </button>

        <button
          onClick={handleSave}
          className={`quote-btn ${saved ? 'active saved' : ''}`}
        >
          {saved ? '🔖 Saved' : '📌 Save'}
        </button>

        <button
          onClick={handleCopy}
          className={`quote-btn ${copied ? 'copied' : ''}`}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
