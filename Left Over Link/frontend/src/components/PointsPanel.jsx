import React from 'react';
// This would fetch from GET /api/points/:restaurantId
const PointsPanel = () => (
  <div className="panel-bg border rounded-lg p-4 mt-4">
    <h3 className="text-xl font-semibold">Your Points Ledger</h3>
    <p className="text-4xl font-bold my-4">1,250</p>
    <ul>
      <li className="flex justify-between py-2 border-b">
        <span>Donation #123 (50 portions)</span>
        <span>+ 500 points</span>
      </li>
      <li className="flex justify-between py-2 border-b">
        <span>Donation #121 (20 portions)</span>
        <span>+ 200 points</span>
      </li>
    </ul>
  </div>
);
export default PointsPanel;