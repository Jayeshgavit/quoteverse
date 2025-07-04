import React, { useState } from 'react';
import './QuoteCard.css';

const QuoteCard = ({ quote }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => setLiked(true);
  const handleSave = () => setSaved(true);
  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="quote-card">
      <div className="quote-text">
        <span className="quote-icon">“</span>{quote.text}<span className="quote-icon">”</span>
      </div>

      <div className="quote-footer">
        <span className="quote-meta">
          — {quote.author} | <strong>{quote.category}</strong> | 📅 {new Date(quote.createdAt).toDateString()}
        </span>

        <div className="quote-actions">
          <button onClick={handleLike} className={liked ? 'liked' : ''}>
            {liked ? '❤️ Liked' : '🤍 Like'}
          </button>

          <button onClick={handleSave} className={saved ? 'saved' : ''}>
            {saved ? '💾 Saved' : '💾 Save'}
          </button>

          <button onClick={handleCopy} className={copied ? 'copied' : ''}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
