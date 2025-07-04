import React, { useEffect, useState } from 'react';
import './QuoteCard.css';

export default function QuoteCard({ quote, userId }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(quote.likes || 0);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // ✅ Set like/save on load
  useEffect(() => {
    if (userId) {
      setLiked(Array.isArray(quote.likedBy) && quote.likedBy.includes(userId));
      setSaved(Array.isArray(quote.savedBy) && quote.savedBy.includes(userId));
    }
  }, [quote, userId]);

  // ❤️ Like handler
  const handleLike = async () => {
    if (!isLoggedIn) return alert('🔐 Please login to like quotes.');

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
        setLikeCount(data.likes);   // 👍 update count
        setLiked(data.liked);       // 🎯 backend controls toggle state
      } else {
        alert('❌ Failed to like quote.');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // 📌 Save handler
  const handleSave = async () => {
     alert('🚧 Save feature is currently under development.');
  return;
    // if (!isLoggedIn) return alert('🔐 Please login to save quotes.');

    // try {
    //   const res = await fetch(`http://localhost:2200/api/quotes/${quote._id}/save`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     }
    //   });

    //   if (res.ok) {
    //     const data = await res.json();
    //     setSaved(data.saved); // ✅ Use actual saved state from backend
    //   } else {
    //     alert('❌ Failed to save quote.');
    //   }
    // } catch (err) {
    //   console.error('Save error:', err);
    // }
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
        {/* ❤️ Like Button */}
        <button
          onClick={handleLike}
          className={`quote-btn ${liked ? 'liked' : ''}`}
        >
          🤍 {likeCount} Likes
        </button>

        {/* 📌 Save Button */}
        <button
          onClick={handleSave}
          className={`quote-btn ${saved ? 'saved active' : ''}`}
        >
          {saved ? '🔖 Saved' : '📌 Save'}
        </button>

        {/* 📋 Copy Button */}
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
