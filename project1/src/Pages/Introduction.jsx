import React from 'react';


const Introduction = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center text-white px-6 py-8 rounded-lg shadow-lg max-w-xl">
        {/* App Name */}
        <h1 className="text-5xl font-bold mb-4">
          Habit Tracker
        </h1>
        
        {/* Introduction Line */}
        <p className="text-lg mb-6">
          Stay on top of your goals and build better habits!
        </p>

        {/* Login Button */}
        <a
          href="/landing"
          className="bg-white text-purple-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
};

export default Introduction;
