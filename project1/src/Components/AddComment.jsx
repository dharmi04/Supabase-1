import { supabase } from '../lib/header/supabaseClient'; 
import { useState } from 'react';

const AddComment = ({ postId, userId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('comments')
            .insert([{ user_id: userId, post_id: postId, content }]);
        
        if (error) {
            console.error('Error adding comment:', error.message);
        } else {
            setContent('');
            console.log('Comment added:', data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input 
                type="text" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Add a comment..." 
                required 
                className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type="submit" 
                className="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 transition duration-200"
            >
                Comment
            </button>
        </form>
    );
};

export default AddComment;
