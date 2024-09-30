// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(cors());
app.use(express.json());

// Route to create a habit
app.post('/create-habit', async (req, res) => {
    const { user_id, habit_name, frequency, reminders } = req.body;

    const { data, error } = await supabase
        .from('habits')
        .insert([{ user_id, habit_name, frequency, reminders }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ habit: data });
});

// Route to fetch all habits
app.get('/habits/:user_id', async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ habits: data });
});

// Route to update a habit
app.put('/update-habit/:habit_id', async (req, res) => {
    const { habit_id } = req.params;
    const { habit_name, frequency, reminders } = req.body;

    const { data, error } = await supabase
        .from('habits')
        .update({ habit_name, frequency, reminders })
        .eq('id', habit_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ habit: data });
});

// Route to delete a habit
app.delete('/delete-habit/:habit_id', async (req, res) => {
    const { habit_id } = req.params;

    const { data, error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habit_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(204).send();
});

// Route to fetch a specific habit
app.get('/habit/:habit_id', async (req, res) => {
    const { habit_id } = req.params;

    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habit_id)
        .single();

    if (error) {
        return res.status(404).json({ error: error.message });
    }
    res.status(200).json({ habit: data });
});

// Endpoint to add a post
app.post('/add-post', async (req, res) => {
  const { user_id, content, image_url } = req.body;

  const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id, content, image_url }]);

  if (error) {
      return res.status(400).json({ error: error.message });
  }
  
  res.status(201).json({ post: data });
});

// Endpoint to like a post
app.post('/like-post', async (req, res) => {
  const { user_id, post_id } = req.body;

  const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .single();

  if (likeError && likeError.code !== 'PGRST116') {
      return res.status(400).json({ error: likeError.message });
  }

  // If like exists, remove it (toggle)
  if (existingLike) {
      const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

      if (deleteError) {
          return res.status(400).json({ error: deleteError.message });
      }

      // Optionally, decrement likes_count in posts table
      await supabase
          .from('posts')
          .update({ likes_count: existingLike.likes_count - 1 })
          .eq('id', post_id);

      return res.status(200).json({ message: 'Post unliked.' });
  } else {
      // If not liked, create a new like
      const { error: insertError } = await supabase
          .from('likes')
          .insert([{ user_id, post_id }]);

      if (insertError) {
          return res.status(400).json({ error: insertError.message });
      }

      // Optionally, increment likes_count in posts table
      await supabase
          .from('posts')
          .update({ likes_count: existingLike.likes_count + 1 })
          .eq('id', post_id);

      return res.status(201).json({ message: 'Post liked.' });
  }
});


// Endpoint to add a comment
app.post('/add-comment', async (req, res) => {
  const { user_id, post_id, content } = req.body;

  const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id, post_id, content }]);

  if (error) {
      return res.status(400).json({ error: error.message });
  }

  // Optionally, increment comments_count in posts table
  await supabase
      .from('posts')
      .update({ comments_count: comments_count + 1 })
      .eq('id', post_id);

  res.status(201).json({ comment: data });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
