import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">QuoteVerse</Link>
      </div>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        {isLoggedIn && <Link to="/add">Add Quote</Link>}
        {isLoggedIn && <Link to="/dashboard">My Quotes</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <button onClick={onLogout} className="logout-btn">Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
