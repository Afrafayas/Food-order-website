import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedItems from '../components/FeaturedItems';

const HomePage = () => {
  return (
    <div className="w-full text-gray-800 font-sans bg-background px-4 sm:px-6 md:px-8">
      <HeroSection />
      <FeaturedItems />
    </div>
  );
};

export default HomePage;
