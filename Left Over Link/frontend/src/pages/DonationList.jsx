import React from 'react';
import DonationCard from '../components/DonationCard';
// This page would fetch from GET /api/donations and map them
const DonationList = () => (
  <div>
    <h1 className="text-2xl">Available Donations (NGO View)</h1>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DonationCard />
      <DonationCard />
    </div>
  </div>
);
export default DonationList;