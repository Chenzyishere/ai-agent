import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Banner from '@/sections/Banner';
import AITimeline from '@/sections/AITimeline';
import AIFeatures from '@/sections/AIFeatures';
import AIIntroSection from '@/sections/AIIntroSection';
import { useThemeStore } from '@/stores/useThemeStore';
export default function Homepage() {
  const {theme} =useThemeStore();
  useEffect(() => {
    document.title = '知微AI对话平台';
  }, []);
  return (
    <div className='bg-white transition-colors duration-300 dark:bg-slate-800'>
      <Header />
      <main id="main-content">
        <Banner />
        <AIIntroSection/>
        <AITimeline />
        <AIFeatures />
      </main>
      <Footer />
    </div>
  );
}
