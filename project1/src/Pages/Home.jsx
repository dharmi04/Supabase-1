import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import YourHabits from '../Components/YourHabits';

const Home = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user);

      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      });
    };

    fetchSession();
  }, [navigate]);

  return (
    <div>
      {user && <Navbar email={user.email} />}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to Dwelify Home Page</h1>
        <p className="mt-4">You are logged in as {user?.email}</p>
        <a href="/addhabit">Add Habit</a>
        <YourHabits />
      </div>
    </div>
  );
};

export default Home;
