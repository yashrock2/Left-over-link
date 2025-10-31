import React from 'react';
import { useAuth } from '../content/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * @param {object} props
 * @param {string[]} [props.roles] - Optional array of roles that are allowed
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, saving the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user has one of them
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // User is authenticated but not authorized
    // Redirect to dashboard or a specific 'unauthorized' page
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // User is authenticated and (if roles specified) authorized
  return <Outlet />;
};

export default ProtectedRoute;