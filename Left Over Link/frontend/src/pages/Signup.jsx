import React, { useState } from 'react';
import { useAuth } from '../content/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validators';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignup = async (formData) => {
    setError(null);
    setMessage(null);

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.role) {
      setError("All fields are required.");
      return;
    }
    if (formData.role === 'NGO' && !formData.registrationDoc) {
      setError("NGOs must upload a registration document.");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Invalid email format.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      // Create FormData object
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      data.append('role', formData.role);
      if (formData.registrationDoc) {
        data.append('registrationDoc', formData.registrationDoc);
      }

      const res = await signup(data);
      setMessage(res.message);
      // Don't auto-login, wait for email verification
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto panel-bg p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {message && <div className="text-green-500 text-center mb-4">{message}</div>}

      {authMethod === 'email' ? (
         <AuthForm
          mode="signup"
          onSubmit={handleEmailSignup}
          error={error}
        />
      ) : (
        <p>Phone OTP Signup Placeholder</p> // Placeholder for PhoneOtp
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => alert('Phone OTP signup UI not fully wired in this scaffold.')}
          className="text-sm"
        >
          Sign up with Phone instead
        </button>
      </div>
    </div>
  );
};

export default Signup;