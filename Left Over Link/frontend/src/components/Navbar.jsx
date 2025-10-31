import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../content/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="panel-bg shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          LeftOverLink
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {user.role === 'RESTAURANT' && <Link to="/donations/new">Donate</Link>}
              {user.role === 'NGO' && <Link to="/donations">Find Food</Link>}
              {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}

              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout} className="font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold">Login</Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;