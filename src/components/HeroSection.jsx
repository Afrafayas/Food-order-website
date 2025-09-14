import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleOrderNow = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'user') return navigate('/user-panel/menu');
    if (user?.role === 'admin') return navigate('/admin-panel');
    navigate('/');
  };

  return (
    <section
      className="w-full h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/banner.jpg')" }}
    >
      <div className="text-center bg-black bg-opacity-60 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 rounded-lg max-w-full sm:max-w-md md:max-w-lg">
        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Delicious Food Delivered Fast
        </h1>
        <p className="text-sm sm:text-lg md:text-xl mb-6">
          Fresh, hot meals at your doorstep.
        </p>
        <button
          onClick={handleOrderNow}
          className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-3 md:px-8 md:py-3 rounded-full transition duration-300"
        >
          Order Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
