import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedItems from '../components/FeaturedItems';

const HomePage = () => {
  return (
    <div className="w-full text-gray-800 font-sans bg-background p-4 sm:p-6 md:p-8">
      <HeroSection />
      <FeaturedItems />
    </div>
  );
};

export default HomePage;
