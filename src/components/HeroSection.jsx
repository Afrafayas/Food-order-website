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
  };

  return (
    <section className="w-full min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/banner.jpg')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🍔 Abu Dhabi's #1 Food Delivery
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            Delicious Food
            <span className="block text-orange-500">Delivered Fast</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
            Fresh, hot meals from the best restaurants in Abu Dhabi — 
            right at your doorstep in 30 minutes! 🚀
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleOrderNow}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Order Now 🍕
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-white/30 hover:border-orange-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              Learn More →
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-3xl font-extrabold text-white">50+</p>
              <p className="text-gray-400 text-sm">Menu Items</p>
            </div>
            <div className="w-px bg-gray-600" />
            <div>
              <p className="text-3xl font-extrabold text-white">30</p>
              <p className="text-gray-400 text-sm">Min Delivery</p>
            </div>
            <div className="w-px bg-gray-600" />
            <div>
              <p className="text-3xl font-extrabold text-white">4.8⭐</p>
              <p className="text-gray-400 text-sm">Rating</p>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-orange-500 rounded-full" />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;