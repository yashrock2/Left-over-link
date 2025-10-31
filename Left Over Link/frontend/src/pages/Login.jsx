import React, { useState } from 'react';
import { useAuth } from '../content/AuthContext';
import AuthForm from '../components/AuthForm';
import PhoneOtp from '../components/PhoneOtp';

const Login = () => {
  const [mode, setMode] = useState('email'); // 'email' or 'phone'
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleEmailLogin = async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
      // Navigate is handled inside AuthContext
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto panel-bg p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

      {mode === 'email' ? (
        <AuthForm mode="login" onSubmit={handleEmailLogin} error={error} />
      ) : (
        <PhoneOtp />
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => setMode(mode === 'email' ? 'phone' : 'email')}
          className="text-sm"
        >
          {mode === 'email' ? 'Login with Phone (OTP)' : 'Login with Email'}
        </button>
      </div>
    </div>
  );
};

export default Login;