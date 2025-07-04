import React, { useState } from 'react';
import './QuoteCard.css';

export default function QuoteCard({ quote }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLike = () => {
    if (!isLoggedIn) {
      alert('🚫 Please login to like quotes.');
      return;
    }
    setLiked((prev) => !prev);
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('🔒 Please login to save quotes.');
      return;
    }
    setSaved((prev) => !prev);
  };

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
          className={`quote-btn ${liked ? 'active' : ''}`}
        >
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>

        <button
          onClick={handleSave}
          className={`quote-btn ${saved ? 'active' : ''}`}
        >
          {saved ? '🔖 Saved' : '📌 Save'}
        </button>

        <button onClick={handleCopy} className="quote-btn">
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
