import { useState, useEffect } from 'react';
import { supabase } from '../lib/header/supabaseClient';  
const YourHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the current session and user details
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user) {
          setError('You need to be logged in to see your habits.');
          setLoading(false);
          return;
        }

        // Fetch habits for the logged-in user
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
        setError('Failed to fetch habits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  // Function to toggle completion status
  const toggleCompletion = async (habitId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ completion_status: !currentStatus }) // Toggle the completion status
        .eq('id', habitId);

      if (error) throw error;

      // Update the local habits state to reflect the change
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId ? { ...habit, completion_status: !currentStatus } : habit
        )
      );
    } catch (error) {
      console.error('Error updating habit completion status:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>
      {loading ? (
        <div className="text-center">Loading your habits...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : habits.length === 0 ? (
        <div className="text-gray-600 text-center">You don't have any habits yet.</div>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li key={habit.id} className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{habit.habit_name}</h3>
                <p className="text-gray-700">{habit.description}</p>
                <p className="text-gray-500">Start Date: {new Date(habit.start_date).toLocaleDateString()}</p>
                <p className="text-gray-500">Frequency: {habit.frequency}</p>
              </div>
              <div>
                <button
                  className={`${
                    habit.completion_status ? 'bg-green-500' : 'bg-gray-300'
                  } text-white font-semibold py-2 px-4 rounded`}
                  onClick={() => toggleCompletion(habit.id, habit.completion_status)}
                >
                  {habit.completion_status ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourHabits;
