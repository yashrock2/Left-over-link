import React, { useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuth } from '../content/AuthContext';
import { useNavigate } from 'react-router-dom';

const PhoneOtp = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { fetchProfile } = useAuth(); // We need to update context
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await apiClient.post('/auth/request-otp', { phone });
      setMessage('OTP sent to your phone. Check console if using mock.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await apiClient.post('/auth/verify-otp', { phone, otp });

      const { token: apiToken } = res.data;

      // Manually set auth state from response
      localStorage.setItem('token', apiToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

      // Tell the AuthContext to refetch the user profile
      await fetchProfile();

      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP.');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone Number (e.g., +15551234567)</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full btn-primary mt-4">
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium">Enter 6-Digit OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full btn-primary mt-4">
            Verify & Login
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneOtp;