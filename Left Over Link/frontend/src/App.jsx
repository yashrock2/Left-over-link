import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import DonationCreate from './pages/DonationCreate';
import DonationList from './pages/DonationList';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  // Apply persisted theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;

    root.classList.remove('theme-light', 'theme-dark', 'theme-eye');
    root.classList.add(`theme-${savedTheme}`);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Restaurant-only Routes */}
          <Route element={<ProtectedRoute roles={['RESTAURANT']} />}>
            <Route path="/donations/new" element={<DonationCreate />} />
          </Route>

          {/* NGO-only Routes */}
          <Route element={<ProtectedRoute roles={['NGO']} />}>
            <Route path="/donations" element={<DonationList />} />
          </Route>

          {/* Admin-only Routes */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* TODO: Add 404 Not Found route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;