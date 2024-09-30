import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnterRoomCode = () => {
  const [roomCode, setRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/join-room', {
        room_code: roomCode,
      });

      if (response.data.success) {
        // Redirect to the trivia game page or another page based on your app's structure
        navigate(`/trivia/${roomCode}`);
      } else {
        setErrorMessage('Invalid room code. Please try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Join a Room</h1>
      <form onSubmit={handleJoinRoom} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
        <h2 className="text-lg font-semibold mb-4">Enter Room Code</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomCode">
            Room Code
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="roomCode"
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Join Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterRoomCode;
