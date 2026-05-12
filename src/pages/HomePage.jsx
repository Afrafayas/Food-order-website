import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedItems from '../components/FeaturedItems';
import HowItWorks from '../components/HowItWorks';

const HomePage = () => {
  return (
    <div className="w-full font-sans">
      <HeroSection />
      <CategoriesSection />
      <FeaturedItems />
      <HowItWorks />
    </div>
  );
};

export default HomePage;