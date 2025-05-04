import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-white font-bold text-xl">Weight Tracker</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
              Clients
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
