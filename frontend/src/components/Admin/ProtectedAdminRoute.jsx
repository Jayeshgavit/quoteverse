// ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const localRole = localStorage.getItem('role');

    if (localRole === 'admin') {
      setIsAdmin(true);
      setLoading(false);
    } else {
      // Double-check role with API (optional but good for security)
      const fetchRole = async () => {
        try {
          const res = await axios.get('/auth/users/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          console.log('🔐 Logged-in Role:', res.data.role);

          if (res.data.role === 'admin') {
            localStorage.setItem('role', 'admin'); // sync in case mismatch
            setIsAdmin(true);
          } else {
            localStorage.setItem('role', res.data.role); // set correct role
          }

        } catch (error) {
          console.error('Auth Check Error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    }
  }, []);

  if (loading) return <p>Loading Admin Dashboard...</p>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
