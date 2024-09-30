// AddPost.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/header/supabaseClient';

const AddPost = () => {
    const [formData, setFormData] = useState({
        content: '',
        imageUrl: '',
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
                setError('You need to be logged in to add a post.');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        user_id: session.user.id, // Use session's user id
                        content: formData.content,
                        image_url: formData.imageUrl || null,
                    },
                ]);

            if (error) throw error;

            setSuccess(true);
            setFormData({
                content: '',
                imageUrl: '',
            });
        } catch (error) {
            console.error('Error inserting post:', error);
            setError('Failed to add post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Add New Post</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">Post added successfully!</div>}

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="What's on your mind?"
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        Image URL (Optional)
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., https://example.com/image.jpg"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Adding...' : 'Add Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPost;
