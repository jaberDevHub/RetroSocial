import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
      alert('Failed to log out: ' + error.message);
    }
  };

  return (
    <nav className="bg-gray-800 text-white py-3 px-5 border-b-4 border-gray-600">
      <div className="container max-w-2xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">RetroSocial</Link>
        <div>
          {currentUser ? (
            <>
              <Link to={`/profile/${currentUser.email.split('@')[0]}`} className="ml-4 px-2 py-1 border border-white text-white hover:bg-gray-700">Profile</Link>
              <button onClick={handleLogout} className="ml-4 px-2 py-1 border border-white text-white hover:bg-gray-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="ml-4 px-2 py-1 border border-white text-white hover:bg-gray-700">Login</Link>
              <Link to="/register" className="ml-4 px-2 py-1 border border-white text-white hover:bg-gray-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;