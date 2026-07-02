import React from 'react';
import Navbar from '../core/components/Navbar';
import Hero from '../core/components/Hero';
import JourneyMap from '../core/components/JourneyMap';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <JourneyMap />
      </main>
    </>
  );
};

export default Home;
