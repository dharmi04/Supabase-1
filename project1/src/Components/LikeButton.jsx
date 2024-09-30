import { supabase } from '../lib/header/supabaseClient'; 
const LikeButton = ({ postId, userId }) => {
    const handleLike = async () => {
        const { data, error } = await supabase
            .from('likes')
            .insert([{ user_id: userId, post_id: postId }]);
        
        if (error) {
            console.error('Error liking post:', error.message);
        } else {
            console.log('Post liked:', data);
        }
    };

    return (
        <button 
            onClick={handleLike} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
            Like
        </button>
    );
};

export default LikeButton;
