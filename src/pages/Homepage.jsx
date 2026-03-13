import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Banner from '@/sections/Banner';
import AITimeline from '@/sections/AITimeline';
import AIFeatures from '@/sections/AIFeatures';
import AIIntroSection from '@/sections/AIIntroSection';
export default function Homepage() {
  return (
    <div>
      <Header />
      <Banner />
      <AIIntroSection/>
      <AITimeline />
      <AIFeatures />
      <Footer />
    </div>
  );
}
