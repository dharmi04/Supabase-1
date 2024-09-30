import React, { useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';

const AddHabit = () => {
  const [formData, setFormData] = useState({
    habitName: '',
    description: '',
    startDate: '',
    frequency: 'daily',
    reminderTime: '',
    goalCount: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const { data: { session } } = await supabase.auth.getSession(); // Get the session object
  
      if (!session || !session.user) {
        setError('You need to be logged in to add a habit.');
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            habit_name: formData.habitName,
            description: formData.description,
            start_date: formData.startDate,
            frequency: formData.frequency,
            reminder_time: formData.reminderTime || null,
            goal_count: formData.goalCount,
            user_id: session.user.id, // Use session's user id
          },
        ]);
  
      if (error) throw error;
  
      setSuccess(true);
      setFormData({
        habitName: '',
        description: '',
        startDate: '',
        frequency: 'daily',
        reminderTime: '',
        goalCount: 1,
      });
    } catch (error) {
      console.error('Error inserting habit:', error);
      setError('Failed to add habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Add New Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">Habit added successfully!</div>}

        {/* Habit Name */}
        <div>
          <label htmlFor="habitName" className="block text-sm font-medium text-gray-700">
            Habit Name
          </label>
          <input
            type="text"
            id="habitName"
            name="habitName"
            value={formData.habitName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., Exercise"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., Go for a morning run"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Reminder Time */}
        <div>
          <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
            Reminder Time (Optional)
          </label>
          <input
            type="time"
            id="reminderTime"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Goal Count */}
        <div>
          <label htmlFor="goalCount" className="block text-sm font-medium text-gray-700">
            Goal Count
          </label>
          <input
            type="number"
            id="goalCount"
            name="goalCount"
            value={formData.goalCount}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., 30"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Adding...' : 'Add Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabit;
