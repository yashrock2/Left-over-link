import React, { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

const Admin = () => {
  const [pendingNgos, setPendingNgos] = useState([]);

  const fetchPendingNgos = async () => {
    try {
      const res = await apiClient.get('/admin/pending-ngos');
      setPendingNgos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingNgos();
  }, []);

  const handleVerify = async (id) => {
    try {
      await apiClient.patch(`/admin/verify-ngo/${id}`);
      fetchPendingNgos(); // Refresh list
    } catch (err) {
      alert('Failed to verify NGO');
    }
  };

  const serverBaseUrl = import.meta.env.VITE_API_BASE.replace('/api', '');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <h2 className="text-2xl font-semibold mb-4">Pending NGO Verifications</h2>
      <div className="space-y-4">
        {pendingNgos.length === 0 && <p>No pending verifications.</p>}
        {pendingNgos.map(ngo => (
          <div key={ngo.id} className="panel-bg p-4 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-bold">{ngo.name}</p>
              <p>{ngo.email}</p>
              <a href={`${serverBaseUrl}${ngo.registrationDocUrl}`} target="_blank" rel="noreferrer" className="text-blue-500">
                View Document
              </a>
            </div>
            <button onClick={() => handleVerify(ngo.id)} className="btn-primary">
              Verify
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Admin;