// File: src/components/Admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
  const [analytics, setAnalytics] = useState({ users: 0, quotes: 0, admins: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    fetchAdminInfo();
    fetchAnalytics();
    fetchUsers();
  }, [page]);

  const fetchAdminInfo = async () => {
    const meRes = await axios.get('/auth/users/me');
    setAdminInfo({ name: meRes.data.name, email: meRes.data.email });
  };

  const fetchAnalytics = async () => {
    const [userRes, quoteRes] = await Promise.all([
      axios.get('/admin/users'),
      axios.get('/quotes/all'),
    ]);
    const adminCount = userRes.data.filter((u) => u.role === 'admin').length;
    setAnalytics({
      users: userRes.data.length,
      quotes: quoteRes.data.quotes.length,
      admins: adminCount,
    });
  };

  const fetchUsers = async () => {
    const res = await axios.get(`/admin/users?page=${page}&limit=${limit}`);
    setUsers(res.data);
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      await axios.delete(`/admin/user/${userId}`);
      fetchUsers();
      setSelectedUser(null);
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      await axios.put(`/admin/user/block/${userId}`);
      fetchUsers();
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      await axios.delete(`/quotes/${quoteId}`);
      fetchUsers();
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.quotes?.some((q) =>
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredQuotes = selectedUser?.quotes?.filter((q) =>
    q.text.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    q.author.toLowerCase().includes(quoteSearch.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p>{adminInfo.name} ({adminInfo.email})</p>
      </header>

      <div className="admin-navigation">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search user by name, email, role, quote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-sections">
        {/* Manage Users */}
        <section className="admin-user-section">
          <h2>👤 Manage Users</h2>
          <div className="admin-user-list">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`admin-user-card ${selectedUser?._id === user._id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <span className="role">{user.role}</span>
                </div>
                <div className="admin-user-actions">
                  <button onClick={(e) => { e.stopPropagation(); handleBlockUser(user._id); }}>🚫</button>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveUser(user._id); }}>❌</button>
                </div>
              </div>
            ))}
          </div>
          <div className="admin-pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>Previous</button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </section>

        {/* Manage Selected User's Quotes */}
        <section className="admin-quote-section">
          {selectedUser ? (
            <>
              <h2>📚 Quotes by {selectedUser.name}</h2>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search quotes or author..."
                value={quoteSearch}
                onChange={(e) => setQuoteSearch(e.target.value)}
              />
              <div className="admin-quote-list">
                {filteredQuotes?.map((q) => (
                  <div className="admin-quote-card" key={q._id}>
                    <p>“{q.text}”</p>
                    <small>{q.author} | {q.category}</small>
                    <button onClick={() => handleDeleteQuote(q._id)}>🗑 Delete</button>
                  </div>
                )) || <p>No quotes found.</p>}
              </div>
            </>
          ) : (
            <p className="admin-placeholder">Select a user to view their quotes.</p>
          )}
        </section>

        {/* Analytics Dashboard */}
        <section className="admin-analytics">
          <h2>📊 Analytics</h2>
          <div className="admin-stats">
            <div className="admin-stat-card">👥 Total Users: {analytics.users}</div>
            <div className="admin-stat-card">🛡 Admins: {analytics.admins}</div>
            <div className="admin-stat-card">📝 Total Quotes: {analytics.quotes}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
