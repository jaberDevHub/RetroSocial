import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const PostCard = ({ post, onPostModified }) => {
  const { currentUser } = useAuth();
  const { updatePost, deletePost } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const isAuthor = currentUser && currentUser.email === post.userEmail;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        alert('Post deleted successfully!');
        if (onPostModified) {
          onPostModified();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post: ' + error.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updatePost(post._id, editedContent);
      alert('Post updated successfully!');
      setIsEditing(false);
      if (onPostModified) {
        onPostModified();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post: ' + error.message);
    }
  };

  

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <div className="flex items-center mb-2">
        <div className="font-bold mr-2">{post.userEmail}</div>
        <div className="text-gray-500 text-xs">{post.createdAt ? new Date(post.createdAt).toLocaleString() : new Date(parseInt(post._id.substring(0, 8), 16) * 1000).toLocaleString()}</div>
      </div>
      {isEditing ? (
        <textarea
          className="w-full p-2 border border-gray-500 focus:outline-none mb-2"
          rows="3"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        ></textarea>
      ) : (
        <>
          <p className="text-gray-800 mb-2">{post.content}</p>
          {post.imageUrl && (
            <div className="my-2">
              <img src={post.imageUrl} alt="Post Image" className="max-w-full h-auto" />
            </div>
          )}
        </>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-2">
          
        </div>
        {isAuthor && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-700 text-white px-3 py-1 border border-blue-900"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-3 py-1 border border-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-700 text-white px-3 py-1 border border-green-900"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-700 text-white px-3 py-1 border border-red-900"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;