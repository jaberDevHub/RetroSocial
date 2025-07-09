import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data.email, data.password, data.username);
      navigate('/');
    } catch (error) {
      console.error('Failed to register', error);
      alert('Failed to register: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-400 mb-4">
      <h1 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            {...register('username')}
            className="w-full p-2 border border-gray-400 focus:outline-none"
          />
          {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
        </div>
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
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">Confirm Password:</label>
          <input
            type="password"
            id="passwordConfirm"
            {...register('passwordConfirm')}
            className="w-full p-2 border border-gray-400 focus:outline-none"
          />
          {errors.passwordConfirm && <p className="text-red-500 text-xs italic">{errors.passwordConfirm.message}</p>}
        </div>
        <button type="submit" className="bg-blue-700 text-white px-3 py-1 border border-blue-900">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
