import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const schema = yup.object().shape({
  content: yup.string().max(280, 'Post cannot exceed 280 characters'),
});

const PostBox = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const { addPost } = usePosts();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.7);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Failed to process image.');
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          try {
            const compressedFile = await compressImage(file);
            setImageFile(compressedFile);
            setImagePreview(URL.createObjectURL(compressedFile));
            event.preventDefault(); // Prevent default paste behavior (e.g., pasting text if any)
            break;
          } catch (error) {
            console.error('Error compressing pasted image:', error);
            alert('Failed to process pasted image.');
          }
        }
      }
    }
  };

  const onSubmit = async (data) => {
    if (!currentUser) {
      alert('You need to be logged in to post.');
      return;
    }

    if (!data.content && !imageFile) {
      alert('Post content or an image is required.');
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        imageUrl = reader.result; // Base64 string
        try {
          await addPost({ content: data.content, userEmail: currentUser.email, imageUrl });
          reset();
          setImageFile(null);
          setImagePreview(null);
          if (onPostCreated) {
            onPostCreated();
          }
        } catch (error) {
          console.error('Error creating post:', error);
          alert('Failed to create post: ' + error.message);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading image file:', error);
        alert('Failed to read image file.');
      };
    } else {
      try {
        await addPost({ content: data.content, userEmail: currentUser.email });
        reset();
        if (onPostCreated) {
          onPostCreated();
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <h2 className="text-lg font-bold mb-2">Create New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register('content', { required: !imageFile ? 'Post content cannot be empty if no image is attached' : false })}
          className="w-full p-2 border border-gray-500 focus:outline-none"
          rows="3"
          placeholder="What's on your mind?"
          onPaste={handlePaste}
        ></textarea>
        {errors.content && <p className="text-red-500 text-xs italic">{errors.content.message}</p>}
        
        {imagePreview && (
          <div className="my-2">
            <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto" />
            <button 
              type="button" 
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="text-red-500 text-sm mt-1"
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <label htmlFor="image-upload" className="bg-gray-200 text-gray-700 px-3 py-1 border border-gray-400 cursor-pointer">
            Photo
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button type="submit" className="bg-blue-700 text-white px-3 py-1 border border-blue-900">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostBox;