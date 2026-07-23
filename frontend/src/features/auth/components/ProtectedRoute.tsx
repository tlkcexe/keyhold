import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Spinner } from '../../../components/ui/Spinner';

/** Wraps routes that require authentication. Preserves the attempted URL so we can redirect back after login. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
