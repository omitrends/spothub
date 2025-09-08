import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`https://spothub.onrender.com/api/auth/verify-email/${token}`);
        setStatus('Email verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setStatus('Verification failed. Link may be expired or invalid.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-6 text-center max-w-md">
        <h2 className="text-xl font-bold mb-4">Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;
