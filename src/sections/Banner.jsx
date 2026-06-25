import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';

const Robot3DCanvas = lazy(() => import('@/components/ui/Robot3DCanvas'));

export default function Banner() {
  const [lookTarget, setLookTarget] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setLookTarget({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setLookTarget({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className="relative h-dvh animate-[gradient-flow_8s_ease_infinite] overflow-hidden bg-linear-to-r from-purple-500 via-pink-500 to-yellow-200 bg-size-[200%_200%]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">
        <h1 className="max-w-lg text-5xl font-black text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
          Chat with Agent
        </h1>
        <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg lg:text-xl">
          知微AI，你的智能对话伙伴
        </p>
        <GradientButton size="large" className="mt-8 w-fit">
          <Link to="/chat">马上开始</Link>
        </GradientButton>
      </div>

      <div className="absolute top-1/2 right-0 z-10 hidden h-1/2 w-1/2 -translate-y-1/2 cursor-grab md:block">
        <Suspense fallback={null}>
          <Robot3DCanvas lookTarget={lookTarget} />
        </Suspense>
      </div>
    </div>
  );
}
