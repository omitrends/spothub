import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as apiSignup } from '../src/api/api';
import { useAuth } from '../src/context/AuthContext';
import googleIcon from '../assets/google.svg';
import { toast } from 'react-toastify';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    inviteCode: '',
  });

  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      toast.error('Name must contain only letters and spaces.');
      return;
    }  

    if (formData.role === 'admin' && !formData.inviteCode) {
      toast.warning('Admin invite code is required.');
      return;
    }

    try {
  const res = await apiSignup(formData);
  console.log("Signup response:", res);

  const { token, user } = res.data || {};
  if (!user) {
    toast.error("Unexpected response from server.");
    return;
  }

  if (user.role === 'admin') {
    contextLogin(token, user);
    toast.success('Admin signup successful!');
    navigate('/admin');
  } else {
    toast.success('Signup successful! Please check your email to verify.');
    navigate('/login');
  }
} catch (err) {
  console.error('Signup failed:', err);
  toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
}

  };

  const handleSocialLoginClick = (e) => {
    if (formData.role === 'admin') {
      e.preventDefault();
      toast.info('Admin signup via social login is not allowed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-2xl shadow-black/40">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">New Account</h2>
        <hr className="mb-4 sm:mb-6 border-t border-gray-300" />

        <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {formData.role === 'admin' && (
            <>
              <div className="text-center text-sm text-red-600 mt-1">
                Admin access requires invite code. Social login not supported.
              </div>
              <input
                type="text"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="Enter Admin Invite Code"
                required
                className="w-full mt-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or Continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href={formData.role === 'admin' ? '#' : 'https://spothub.onrender.com/api/auth/google'}
            onClick={handleSocialLoginClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-sm">Google</span>
          </a>
          
        </div>
      </div>
    </div>
  );
}

export default SignUp;
