import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JourneyMap from '../components/JourneyMap';

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
