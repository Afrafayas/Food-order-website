import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authSlice';
import { loginUser, registerUser, verifyOTP } from '../services/api';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(loginData);
      dispatch(login({ token: res.data.token, user: res.data.user }));
      toast.success('Login successful!');
      if (res.data.user.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/user-panel');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(registerData);
      setEmail(registerData.email);
      toast.success('OTP sent to your email!');
      setTab('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verify
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOTP({ email, otp });
      dispatch(login({ token: res.data.token, user: res.data.user }));
      toast.success('Email verified!');
      navigate('/user-panel');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">🍔 BiteCraft</h1>
          <p className="text-gray-500 text-sm mt-1">Delicious food at your doorstep</p>
        </div>

        {/* OTP Page */}
        {tab === 'otp' ? (
          <form onSubmit={handleVerifyOTP}>
            <h2 className="text-xl font-bold text-center mb-2">Verify OTP</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              OTP sent to <span className="text-orange-500 font-semibold">{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-orange-400 mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <p
              className="text-center text-sm text-gray-500 mt-4 cursor-pointer hover:text-orange-500"
              onClick={() => setTab('register')}
            >
              ← Back to Register
            </p>
          </form>

        ) : (
          <>
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  tab === 'login' ? 'bg-white shadow text-orange-500' : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  tab === 'register' ? 'bg-white shadow text-orange-500' : 'text-gray-500'
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
                >
                  {loading ? 'Sending OTP...' : 'Register'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;