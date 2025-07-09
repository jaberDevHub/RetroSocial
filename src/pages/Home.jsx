import React, { useEffect, useState, useCallback } from 'react';
import PostBox from '../components/PostBox';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Home Feed</h1>
      <PostBox onPostCreated={fetchPosts} />
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} onPostModified={fetchPosts} />
          ))
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
