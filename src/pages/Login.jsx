import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Failed to log in', error);
      alert('Failed to log in: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <h1 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full p-2 border border-gray-400 focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full p-2 border border-gray-400 focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
        </div>
        <button type="submit" className="bg-blue-700 text-white px-3 py-1 border border-blue-900">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;