import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Banner from '@/sections/Banner';
import AITimeline from '@/sections/AITimeline';
import AIFeatures from '@/sections/AIFeatures';
import AIIntroSection from '@/sections/AIIntroSection';
import { useThemeStore } from '@/stores/useThemeStore';
export default function Homepage() {
  const {theme} =useThemeStore();
  return (
    <div className='bg-white transition-colors duration-300 dark:bg-slate-800'>
      <Header />
      <Banner />
      <AIIntroSection/>
      <AITimeline />
      <AIFeatures />
      <Footer />
    </div>
  );
}
