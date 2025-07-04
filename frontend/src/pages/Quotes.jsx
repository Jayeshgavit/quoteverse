import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import axios from '../api/axios';
import QuoteCard from '../components/QuoteCard';
import './Quotes.css';

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  const token = localStorage.getItem('token');
const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.userId || decoded?._id; // Adjust based on your token payload

  // ✅ Fetch quotes from backend
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get('/quotes/all'); // backend route
        setQuotes(res.data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  // ✅ Apply filters and sorting
  useEffect(() => {
    let result = [...quotes];

    if (searchTerm) {
      result = result.filter((q) =>
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((q) => q.category === selectedCategory);
    }

    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredQuotes(result);
  }, [quotes, searchTerm, selectedCategory, sortOption]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="quotes-container">
      <div className="quotes-wrapper">

        {/* 📚 Header */}
        <div className="quotes-header">
          <h2>📚 Discover Quotes</h2>
          <p>Search your thoughts, filter by feelings, sort your mood</p>
        </div>

        {/* 🔍 Controls */}
        <div className="quote-controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by keyword or author..."
              className="quote-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>❌</button>
            )}
          </div>

          <select
            className="quote-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">🔄 Newest First</option>
            <option value="oldest">📜 Oldest First</option>
          </select>
        </div>

        {/* 🎨 Categories */}
        <div className="quote-categories">
          {['All', 'Life', 'Love', 'Motivation', 'Wisdom', 'Success', 'Friendship'].map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📝 Quotes List */}
        <div className="quote-list">
          {filteredQuotes.length === 0 ? (
            <p className="no-quotes">No quotes found.</p>
          ) : (
            filteredQuotes.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} userId={userId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
