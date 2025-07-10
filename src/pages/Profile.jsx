import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const Profile = () => {
  const { username } = useParams(); // This will be the email prefix from Firebase
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserPosts = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/posts?userEmail=${currentUser.email}`);
      const data = await response.json();
      setUserPosts(data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load user posts.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  const isOwner = currentUser && currentUser.email.split('@')[0] === username;

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <h1 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Profile of {username}</h1>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Email:</h2>
        <p>{currentUser ? currentUser.email : 'Not logged in'}</p>
        {isOwner && (
          <Link to={`/profile/${username}/edit`} className="bg-blue-700 text-white px-3 py-1 border border-blue-900 mt-2 inline-block">
            Edit Profile
          </Link>
        )}
      </div>

      <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-2">Posts by {username}</h2>
      <div>
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard key={post._id} post={post} onPostModified={fetchUserPosts} />
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
