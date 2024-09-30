import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to check if user exists in "Users" table and add if necessary
  const addUserToTable = async (user) => {
    try {
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && !existingUser) {
        // User does not exist, so add them to the "users" table
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              username: user.email.split('@')[0], // Default username from email
              high_score: 0, // Default high score
            },
          ]);

        if (insertError) {
          console.error('Error inserting user into table:', insertError.message);
        } else {
          console.log('User added to the database:', data);
        }
      }
    } catch (err) {
      console.error('Error checking or adding user:', err.message);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during login:', error.message);
    } else {
      await addUserToTable(user); // Add user to "Users" table if necessary
      navigate('/home'); // Redirect after login
    }
  };

  // Login with Email/Password
  const handleLogin = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error during login:', error.message);
    } else {
      setErrorMessage('');
      await addUserToTable(user); // Add user to "Users" table if necessary
      navigate('/home'); // Redirect after login
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        navigate('/'); // Redirect if user is already logged in
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login to Dwelify</h1>
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
        <h2 className="text-lg font-semibold mb-4">Sign In</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm">Or</p>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2"
          onClick={loginWithGoogle}
        >
          Login with Google
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm">Don't have an account?</p>
        <button
          className="text-blue-500 underline"
          onClick={() => navigate('/signup')} // Navigate to sign-up page
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
