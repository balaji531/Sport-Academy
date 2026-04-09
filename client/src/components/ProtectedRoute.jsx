import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const userRole = String(user.role || '').trim().toLowerCase();
  const allowedRoles = roles?.map(r => String(r).trim().toLowerCase());

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute blocked:', {
      userRole,
      allowedRoles,
      user,
    });
    return <Navigate to="/login" replace />;
  }

  return children;
}
