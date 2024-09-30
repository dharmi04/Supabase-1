// Feed.jsx
import React, { useEffect, useState } from 'react';
import AddPost from './AddPost';
import LikeButton from '../Components/LikeButton';
import AddComment from '../Components/AddComment';
import { supabase } from '../lib/header/supabaseClient';  
 // Ensure you import the Supabase client

const Feed = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*, users(username)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error.message);
        } else {
            setPosts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AddPost userId={userId} /> {/* Ensure userId is passed */}
            {posts.map((post) => (
                <div key={post.id}>
                    <h3>{post.users.username}</h3>
                    <p>{post.content}</p>
                    <LikeButton postId={post.id} userId={userId} />
                    <AddComment postId={post.id} userId={userId} />
                </div>
            ))}
        </div>
    );
};

export default Feed;
