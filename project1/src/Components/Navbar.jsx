import React, { useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';  // Import supabase to handle logout
import { useNavigate } from 'react-router-dom';

const Navbar = ({ email }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();  // Supabase logout method
    navigate('/');  // Navigate back to landing page after logout
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Dwelify</h1>

        {/* Right-side profile picture with dropdown */}
        <div className="relative">
          <div 
            className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center text-white cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            {email.charAt(0).toUpperCase()}
          </div>

          {/* Dropdown menu for profile */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 p-2 rounded shadow-lg">
              <p className="text-gray-600 mb-2">{email}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
