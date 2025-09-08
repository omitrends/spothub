import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPackage, FiHelpCircle } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center font-inter text-gray-900 px-4 overflow-hidden">
      
      {/* === Static SVG Background === */}
      <svg
        viewBox="0 0 1440 320"
        className="absolute inset-0 w-full h-full -z-10"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
          <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
        </defs>

        <path
          fill="url(#bgGrad1)"
          d="M0,160L80,170.7C160,181,320,203,480,213.3C640,224,800,224,960,197.3C1120,171,1280,117,1360,100L1440,80L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          opacity="0.6"
        />
        <path
          fill="url(#bgGrad2)"
          d="M0,96L80,122.7C160,149,320,203,480,192C640,181,800,107,960,101.3C1120,96,1280,160,1360,186.7L1440,213.3L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          opacity="0.75"
        />
      </svg>

      {/* === Static Floating Icons === */}
      <div className="absolute text-blue-300 z-0" style={{ top: '20%', left: '10%' }}>
        <FiSearch size={28} />
      </div>
      <div className="absolute text-blue-300 z-0" style={{ top: '70%', left: '80%' }}>
        <FiPackage size={28} />
      </div>
      <div className="absolute text-blue-300 z-0" style={{ top: '50%', left: '25%' }}>
        <FiHelpCircle size={28} />
      </div>

      {/* === Main Content === */}
      <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-16 sm:py-20 text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight drop-shadow-md">
          How can we help you?
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl mb-10 max-w-xl">
          Lost or found something? We’re here to connect you with the right people.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
          <button
            onClick={() => navigate('/lost-item')}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl focus:outline-none"
          >
            🔍 Lost Something?
          </button>

          <button
            onClick={() => navigate('/found-item')}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl focus:outline-none"
          >
            📦 Found Something?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
