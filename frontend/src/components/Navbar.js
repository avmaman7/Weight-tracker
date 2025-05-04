import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Use test API instead of regular API
import { logout } from '../services/test-api';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      navigate('/login');
      // Force page refresh to clear any state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Only make the title a link to home if user is logged in */}
          {user ? (
            <Link to="/" className="flex items-center">
              <span className="text-white font-bold text-xl">Weight Tracker</span>
            </Link>
          ) : (
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">Weight Tracker</span>
            </div>
          )}
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                  Clients
                </Link>
                <div className="text-white px-3">
                  Welcome, {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
