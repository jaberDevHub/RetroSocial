import React from 'react';
import { useParams } from 'react-router-dom';

const EditProfile = () => {
  const { username } = useParams();

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <h1 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Edit Profile for {username}</h1>
      <p>Profile editing is not yet implemented with the current backend setup.</p>
      <p>To enable profile editing, you would need to add a dedicated user update endpoint to your backend.</p>
    </div>
  );
};

export default EditProfile;