import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItWorks';
import Testimonials from '../components/Home/Testimonials';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;