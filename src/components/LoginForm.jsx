import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = ({ username, password }) => {
    if (username === 'admin' && password === '1234') {
      dispatch(login({ username, role: 'admin' }));
      navigate('/admin-panel');
    } else if (username === 'user' && password === '1234') {
      dispatch(login({ username, role: 'user' }));
      navigate('/user-panel');
    } else {
      toast.error('Invalid Credentials');
    }
  };

  

  return (
    <>

    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-72 space-y-4">
        <input
          {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
          placeholder="Username" 
           className="p-2 border border-gray-300 rounded-md text-sm"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Minimum 4 characters' } })}
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"  >Login</button>
      </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm; 