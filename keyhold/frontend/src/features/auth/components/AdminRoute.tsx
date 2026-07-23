import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/** Wraps routes that require the ADMIN role. Use nested inside ProtectedRoute. */
export function AdminRoute() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
