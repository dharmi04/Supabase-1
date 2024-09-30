import { useEffect, useState } from 'react';
import { supabase } from '../lib/header/supabaseClient'; // Adjust the import based on your setup

const YourPosts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*, users(display_name, email)'); // Corrected to match the users table without aliasing

            if (error) {
                console.error("Error fetching posts:", error);
                setError(error);
            } else {
                setPosts(data);
            }
        };

        fetchPosts();
    }, []);

    if (error) {
        return <div className="text-red-500">Error fetching posts: {error.message}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Posts</h1>
            {posts.map((post) => (
                <div key={post.id} className="mb-4 p-4 border rounded-lg hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                    <p className="text-gray-700">{post.content}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Posted by: {post.users.display_name} ({post.users.email})
                    </p>
                </div>
            ))}
        </div>
    );
};

export default YourPosts;
