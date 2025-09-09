import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleOrderNow = () => {
    switch (true) {
      case !isAuthenticated:
        navigate('/login');
        break;
      case user?.role === 'user':
        navigate('/user-panel/menu');
        break;
      case user?.role === 'admin':
        navigate('/admin-panel');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <section
      className="bg-cover bg-center h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-screen flex items-center justify-center text-white bg-gray-800"
      style={{ backgroundImage: "url('/images/banner.jpg')" }}
    >
      <div className="text-center bg-black bg-opacity-60 px-4 py-8 md:px-10 md:py-12 rounded-lg max-w-sm sm:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl md:text-5xl font-bold mb-4 leading-tight">
          Delicious Food Delivered Fast
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Fresh, hot meals at your doorstep.
        </p>
        <button
          onClick={handleOrderNow}
          className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 md:px-8 md:py-3 rounded-full transition duration-300"
        >
          Order Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
