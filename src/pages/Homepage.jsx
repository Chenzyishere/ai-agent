import React from 'react';
import Header from '@/components/ui/Header';
import Carousel from '../components/ui/Carousel';
import Masonry from '../components/ui/Masonry';
import { Image,Button} from 'antd';
import Footer from '@/components/ui/Footer';
import GradientButton from '@/components/ui/GradientButton';
import PirateIcon from '@/components/icons/PirateIcon';

export default function Homepage() {
  return (
    <>
      <Header />
      <div className="relative h-lvh animate-[gradient-flow_8s_ease_infinite] overflow-hidden bg-linear-to-r from-purple-500 via-pink-500 to-yellow-500 bg-size-[200%_500%]">
        
        <h1 className="absolute top-2/5 left-1/10 z-10 -translate-y-1/2 text-7xl font-black text-white drop-shadow-lg w-1">
          Talk to the Agent
        </h1>
      <GradientButton 
  href="/ChatPage" 
  size="large" 
  className="absolute top-[83%] left-[10%] z-10 -translate-y-1/2 "
>
  Start right now
</GradientButton>
    
      </div>
      <Masonry/>
      <Footer />
    </>
  );
}
