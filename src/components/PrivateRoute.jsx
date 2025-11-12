import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function PrivateRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // While auth state is being confirmed, show a loading placeholder so that
  // a logged-in user remains on private pages after a full page reload.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Authenticating..." />
      </div>
    )
  }

  if (!user) {
    // Preserve the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User is authenticated — render child routes
  return <Outlet />
}
