import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

// ✅ Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const linkClasses = ({ isActive }) =>
    `text-gray-700 hover:text-blue-600 ${isActive ? 'text-red-600 font-semibold' : ''}`;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-md px-6 sm:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-600">SpotHub</h1>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md px-6 sm:px-8 py-4">
      {/* ✅ Toast container added here */}
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">SpotHub</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className={linkClasses}>Home</NavLink>
          <NavLink to="/about" className={linkClasses}>About</NavLink>
          {user ? (
            <>
              <NavLink to={user.role === 'admin' ? '/admin' : '/user'} className={linkClasses}>
                <div className="flex items-center space-x-1">
                  <UserCircle size={20} />
                  <span>{user.username || 'Profile'}</span>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>Login</NavLink>
              <NavLink to="/signup" className={linkClasses}>Sign Up</NavLink>
            </>
          )}
        </div>

        {/* Hamburger icon (mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4">
          <NavLink to="/" className={linkClasses} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClasses} onClick={() => setIsOpen(false)}>About</NavLink>
          {user ? (
            <>
              <NavLink to="/user" className={linkClasses} onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-1">
                  <UserCircle size={20} />
                  <span>{user.username || 'Profile'}</span>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses} onClick={() => setIsOpen(false)}>Login</NavLink>
              <NavLink to="/signup" className={linkClasses} onClick={() => setIsOpen(false)}>Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
