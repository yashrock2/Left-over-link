import React from 'react';
import { useAuth } from '../content/AuthContext';
import { Link } from 'react-router-dom';
import PointsPanel from '../components/PointsPanel';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
      <p>Your role: <strong>{user.role}</strong></p>

      {user.role === 'RESTAURANT' && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Your Impact</h2>
          <PointsPanel />
          <Link to="/donations/new" className="btn-primary mt-4 inline-block">
            Create New Donation
          </Link>
        </div>
      )}

      {user.role === 'NGO' && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Available Food</h2>
          <p>Your reputation: {user.reputation || 0}</p>
          <Link to="/donations" className="btn-primary mt-4 inline-block">
            Browse Donations
          </Link>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Admin Actions</h2>
          <Link to="/admin" className="btn-primary mt-4 inline-block">
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
};
export default Dashboard;