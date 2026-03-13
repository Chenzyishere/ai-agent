import React from 'react';
import Header from '@/components/ui/Header';
import Banner from '@/components/ui/Banner';
import AITimeline from '../components/ui/AITimeline';
import AIFeatures from '../components/ui/AIFeatures';
import Footer from '@/components/ui/Footer';
import AIIntroSection from '@/components/ui/AIIntroSection';
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
