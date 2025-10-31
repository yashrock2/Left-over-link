import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold mb-4">
        Stop Waste. Start Giving.
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        LeftOverLink connects restaurants with surplus food to NGOs who can distribute it to those in need.
      </p>
      <div className="space-x-4">
        <Link to="/signup" className="btn-primary text-lg px-8 py-3">
          Donate Food (Restaurant)
        </Link>
        <Link to="/signup" className="btn-primary text-lg px-8 py-3">
          Claim Food (NGO)
        </Link>
      </div>
    </div>
  );
};

export default Hero;