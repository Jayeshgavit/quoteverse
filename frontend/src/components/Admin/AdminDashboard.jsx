// // File: src/components/Admin/AdminDashboard.jsx
// import { useEffect, useState } from 'react';
// import axios from '../../api/axios';
// import './AdminDashboard.css';

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [quotes, setQuotes] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchUser, setSearchUser] = useState('');
//   const [searchQuote, setSearchQuote] = useState('');
//   const [analytics, setAnalytics] = useState({ users: 0, quotes: 0, admins: 0 });
//   const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   useEffect(() => {
//     fetchAdminInfo();
//     fetchAnalytics();
//     fetchUsers();
//   }, [page]);

//   const fetchAdminInfo = async () => {
//     const res = await axios.get('/auth/users/me');
//     setAdminInfo({ name: res.data.name, email: res.data.email });
//   };

//   const fetchAnalytics = async () => {
//     const res = await axios.get('/admin/analytics');
//     setAnalytics(res.data);
//   };

//   const fetchUsers = async () => {
//     const res = await axios.get(`/admin/users?page=${page}&limit=${limit}`);
//     setUsers(res.data.users);
//     setSelectedUser(null);
//     setQuotes([]);
//   };

//   const fetchUserQuotes = async (user) => {
//     setSearchQuote('');
//     setSelectedUser(user);
//     const res = await axios.get(`/admin/user/${user._id}/quotes`);
//     setQuotes(res.data);
//   };

//   const handleBlockUser = async (id) => {
//     if (!window.confirm('Block this user?')) return;
//     await axios.put(`/admin/user/block/${id}`);
//     fetchUsers();
//   };

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm('Delete this user? This is irreversible.')) return;
//     await axios.delete(`/admin/user/${id}`);
//     fetchUsers();
//   };

//   const handleDeleteQuote = async (qid) => {
//     if (!window.confirm('Delete this quote?')) return;
//     await axios.delete(`/quotes/${qid}`);
//     fetchUserQuotes(selectedUser);
//   };

//   const filteredUsers = users.filter(u =>
//     u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
//     u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
//     u.role.toLowerCase().includes(searchUser.toLowerCase())
//   );

//   const filteredQuotes = quotes.filter(q =>
//     q.text.toLowerCase().includes(searchQuote.toLowerCase()) ||
//     q.author.toLowerCase().includes(searchQuote.toLowerCase())
//   );

//   return (
//     <div className="adm-dashboard-wrapper">
//       <header className="adm-dashboard-header">
//         <h1>🔐 Admin Dashboard</h1>
//         <p>👤 {adminInfo.name} | 📧 {adminInfo.email}</p>
//         <p>📊 Users: {analytics.users} | Admins: {analytics.admins} | Quotes: {analytics.quotes}</p>
//       </header>

//       <div className="adm-dashboard-sections">
//         {/* User Management */}
//         <section className="adm-user-section">
//           <h2>👥 Manage Users</h2>
//           <input
//             type="text"
//             className="adm-search-input"
//             placeholder="Search users by name, email or role..."
//             value={searchUser}
//             onChange={(e) => setSearchUser(e.target.value)}
//           />
//           <div className="adm-user-list">
//             {filteredUsers.map(user => (
//               <div
//                 key={user._id}
//                 className="adm-user-card"
//                 onClick={() => fetchUserQuotes(user)}
//               >
//                 <p><strong>{user.name}</strong> <small>({user.email})</small></p>
//                 <small>Role: {user.role}</small>
//                 {user.role !== 'admin' && (
//                   <div className="adm-user-actions">
//                     <button onClick={e => { e.stopPropagation(); handleBlockUser(user._id); }}>🚫 Block</button>
//                     <button onClick={e => { e.stopPropagation(); handleDeleteUser(user._id); }}>❌ Delete</button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="adm-pagination">
//             <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
//             <span>Page {page}</span>
//             <button disabled={users.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
//           </div>
//         </section>

//         {/* Quote Management */}
//         <section className="adm-quote-section">
//           {selectedUser && (
//             <>
//               <h2>📝 Quotes by {selectedUser.name}</h2>
//               <input
//                 type="text"
//                 className="adm-search-input"
//                 placeholder="Search quotes by text or author..."
//                 value={searchQuote}
//                 onChange={(e) => setSearchQuote(e.target.value)}
//               />
//               <div className="adm-quote-list">
//                 {filteredQuotes.length ? (
//                   filteredQuotes.map(q => (
//                     <div key={q._id} className="adm-quote-card">
//                       <p>“{q.text}”</p>
//                       <small>— {q.author}</small>
//                       <button onClick={() => handleDeleteQuote(q._id)}>🗑 Delete</button>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="adm-placeholder">No matching quotes found.</p>
//                 )}
//               </div>
//             </>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }
// File: src/components/Admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [searchQuote, setSearchQuote] = useState('');
  const [analytics, setAnalytics] = useState({ users: 0, quotes: 0, admins: 0 });
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchAdminInfo();
    fetchAnalytics();
    fetchUsers();
  }, [page]);

  const fetchAdminInfo = async () => {
    const res = await axios.get('/auth/users/me');
    setAdminInfo({ name: res.data.name, email: res.data.email });
  };

  const fetchAnalytics = async () => {
    const res = await axios.get('/admin/analytics');
    setAnalytics(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`/admin/users?page=${page}&limit=${limit}`);
    setUsers(res.data.users);
    setSelectedUser(null);
    setQuotes([]);
  };

  const fetchUserQuotes = async (user) => {
    setSearchQuote('');
    setSelectedUser(user);
    const res = await axios.get(`/admin/user/${user._id}/quotes`);
    setQuotes(res.data);
  };

  const handleBlockUser = async (id) => {
    if (!window.confirm('Block this user?')) return;
    await axios.put(`/admin/user/block/${id}`);
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/admin/user/${id}`);
    fetchUsers();
  };

  const handleDeleteQuote = async (qid) => {
    if (!window.confirm('Delete this quote?')) return;
    await axios.delete(`/quotes/${qid}`);
    fetchUserQuotes(selectedUser);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredQuotes = quotes.filter(q =>
    q.text.toLowerCase().includes(searchQuote.toLowerCase()) ||
    q.author.toLowerCase().includes(searchQuote.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p>👤 {adminInfo.name} | 📧 {adminInfo.email}</p>
        <p>📊 Users: {analytics.users} | Admins: {analytics.admins} | Quotes: {analytics.quotes}</p>
      </header>

      <div className="admin-sections">
        {/* LEFT PANEL */}
        <section className="admin-user-panel">
          <h2>👥 Manage Users</h2>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search users by name, email or role..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <div className="admin-user-scroll">
            {filteredUsers.map(user => (
              <div
                key={user._id}
                className={`admin-user-card ${selectedUser?._id === user._id ? 'selected' : ''}`}
                onClick={() => fetchUserQuotes(user)}
              >
                <div className="admin-user-card__header">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <span className={`admin-user-card__role ${user.role}`}>{user.role}</span>
                </div>
                {user.role !== 'admin' && (
                  <div className="admin-user-card__actions">
                    <button onClick={(e) => { e.stopPropagation(); handleBlockUser(user._id); }}>🚫</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user._id); }}>❌</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="admin-pagination">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="admin-quote-panel">
          {selectedUser ? (
            <>
              <h2>📝 Quotes by {selectedUser.name}</h2>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search quotes by text or author..."
                value={searchQuote}
                onChange={(e) => setSearchQuote(e.target.value)}
              />
              <div className="admin-quote-list">
                {filteredQuotes.length ? (
                  filteredQuotes.map(q => (
                    <div key={q._id} className="admin-quote-card">
                      <p>“{q.text}”</p>
                      <small>— {q.author}</small>
                      <button onClick={() => handleDeleteQuote(q._id)}>🗑</button>
                    </div>
                  ))
                ) : (
                  <p className="admin-empty-note">No matching quotes found.</p>
                )}
              </div>
            </>
          ) : (
            <p className="admin-empty-note">👈 Select a user to view quotes.</p>
          )}
        </section>
      </div>
    </div>
  );
}
