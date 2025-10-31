import React, { useState } from 'react';

// Reusable form for email/password login and signup
const AuthForm = ({ mode = 'login', onSubmit, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'RESTAURANT',
    registrationDoc: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isSignup = mode === 'signup';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Full Name / Org Name</label>
          <input type="text" name="name" id="name" required={isSignup} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input type="email" name="email" id="email" required onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input type="password" name="password" id="password" required onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      {isSignup && (
        <>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone (e.g., +15551234567)</label>
            <input type="tel" name="phone" id="phone" required={isSignup} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium">I am a...</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="RESTAURANT">Restaurant</option>
              <option value="NGO">NGO</option>
            </select>
          </div>

          {formData.role === 'NGO' && (
            <div>
              <label htmlFor="registrationDoc" className="block text-sm font-medium">NGO Registration Document (PDF/Image)</label>
              <input type="file" name="registrationDoc" id="registrationDoc" required={formData.role === 'NGO'} accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          )}
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="w-full btn-primary">
        {isSignup ? 'Create Account' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;