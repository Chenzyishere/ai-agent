import React from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
export default function Banner() {
  return (
          <div className="relative h-lvh animate-[gradient-flow_8s_ease_infinite] overflow-hidden bg-linear-to-r from-purple-500 via-pink-500 to-yellow-200 bg-size-[200%_200%]">
        <h1 className="absolute top-2/5 left-1/10 z-10 w-1 -translate-y-1/2 text-7xl font-black text-white drop-shadow-lg">
          跟AI对话
        </h1>
        <GradientButton
          size="large"
          className="absolute top-[83%] left-[10%] z-10 -translate-y-1/2"
        >
          <Link to="/chat">马上开始</Link>
        </GradientButton>
      </div>
  )
}
