import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error during login:', error.message);
    } else {
      // Navigate to the home page after successful login
      navigate('/home');
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      // If session exists, directly navigate to the home page
      if (session) {
        navigate('/home');
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          navigate('/home');
        }
      });
    };

    fetchSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Welcome to Dwelify</h2>
        <button 
          onClick={login} 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Landing;
