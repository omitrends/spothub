import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPackage, FiHelpCircle } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center font-inter text-gray-900 px-4 overflow-hidden bg-blue-50">
      
      {/* === Decorative Elements === */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>

      {/* === Floating Icons with Animation === */}
      <div className="absolute text-blue-400 z-0 animate-float" style={{ top: '15%', left: '10%' }}>
        <FiSearch size={32} />
      </div>
      <div className="absolute text-blue-500 z-0 animate-float-delay-1" style={{ top: '65%', left: '85%' }}>
        <FiPackage size={32} />
      </div>
      <div className="absolute text-blue-400 z-0 animate-float-delay-2" style={{ top: '45%', left: '20%' }}>
        <FiHelpCircle size={32} />
      </div>
      <div className="absolute text-blue-300 z-0 animate-float" style={{ top: '25%', right: '15%' }}>
        <FiSearch size={24} />
      </div>
      <div className="absolute text-blue-400 z-0 animate-float-delay-1" style={{ bottom: '20%', right: '10%' }}>
        <FiPackage size={24} />
      </div>

      {/* === Main Content === */}
      <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-16 sm:py-20 text-center z-10 relative">
        {/* Main Card */}
        <div className="backdrop-blur-sm bg-white rounded-3xl shadow-2xl p-10 sm:p-14 border border-blue-100 max-w-3xl">
          <div className="inline-block mb-6 px-5 py-2 bg-blue-600 rounded-full shadow-md">
            <span className="text-white text-sm font-semibold tracking-wide">SPOT HUB</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-600 mb-6 leading-tight">
            How can we help you?
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Lost or found something? We're here to connect you with the right people instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl justify-center">
            <button
              onClick={() => navigate('/lost-item')}
              className="group relative flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <span>Lost Something?</span>
              </span>
            </button>

            <button
              onClick={() => navigate('/found-item')}
              className="group relative flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <span>Found Something?</span>
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Active community • Fast responses</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default Home; 