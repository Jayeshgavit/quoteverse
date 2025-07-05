// ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "../../api/axios"; // ✅ correct


export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get('/auth/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('🔐 Logged-in Role:', res.data.role);
        if (res.data.role === 'admin') {
          setIsAdmin(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth Check Error:', error);
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
