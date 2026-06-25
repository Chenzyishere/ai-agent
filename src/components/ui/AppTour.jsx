import React, { useState, useEffect, useMemo } from 'react';

const defaultSteps = [];

export default function AppTour({ steps = defaultSteps, onFinish, delay = 600 }) {
  const [current, setCurrent] = useState(0);
  const [targets, setTargets] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    const map = {};
    steps.forEach((s) => {
      const el = document.querySelector(s.selector);
      if (el) map[s.selector] = el;
    });
    setTargets(map);
  }, [steps]);

  const visibleSteps = useMemo(
    () => steps.filter((s) => !!targets[s.selector]),
    [steps, targets],
  );

  const step = visibleSteps[current] || null;

  useEffect(() => {
    if (!step && visibleSteps.length > 0 && current < visibleSteps.length) {
      setCurrent((c) => c + 1);
    }
  }, [step, current, visibleSteps.length]);

  const el = step ? targets[step.selector] : null;
  const rect = el ? stepRect(el) : { left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0 };

  const shouldRender = ready && visibleSteps.length > 0 && step && el;

  const isLastStep = current >= visibleSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinish?.();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleSkip = () => {
    onFinish?.();
  };

  if (!shouldRender) return null;

  const cardStyle = getCardPosition(step.placement || 'bottom', rect);

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: 'none' }}>
      <div className="absolute inset-0 bg-black/50 transition-all duration-300" style={{ pointerEvents: 'auto' }}>
        <div
          className="absolute rounded-xl ring-2 ring-purple-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-300"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      </div>

      <div
        className="absolute z-10 w-72 rounded-2xl border border-white/15 bg-[#1e1640]/95 p-5 shadow-2xl backdrop-blur-2xl"
        style={{ ...cardStyle, pointerEvents: 'auto' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-white/30">
            {current + 1} / {visibleSteps.length}
          </span>
          <div className="flex gap-1">
            {visibleSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === current ? 'w-4 bg-purple-400' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="mb-1.5 text-sm font-semibold text-white">{step.title}</h3>
        <p className="mb-4 text-xs leading-relaxed text-white/60">{step.description}</p>

        <div className="flex items-center justify-between">
          <button onClick={handleSkip} className="text-xs text-white/30 transition-colors hover:text-white/60">
            跳过全部
          </button>
          <button onClick={handleNext} className="rounded-lg bg-purple-500/20 px-4 py-1.5 text-xs font-medium text-purple-300 transition-all hover:bg-purple-500/30">
            {isLastStep ? '完成' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
}

function stepRect(el) {
  const r = el.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    bottom: r.bottom,
    right: r.right,
  };
}

function getCardPosition(placement, rect) {
  const gap = 16;
  const cardW = 288;
  const cardH = 180;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  switch (placement) {
    case 'top':
      return {
        left: Math.max(16, Math.min(vw - cardW - 16, rect.left + rect.width / 2 - cardW / 2)),
        top: Math.max(16, rect.top - cardH - gap),
      };
    case 'bottom':
      return {
        left: Math.max(16, Math.min(vw - cardW - 16, rect.left + rect.width / 2 - cardW / 2)),
        top: Math.min(vh - cardH - 16, rect.bottom + gap),
      };
    case 'left':
      return {
        left: Math.max(16, rect.left - cardW - gap),
        top: Math.max(16, Math.min(vh - cardH - 16, rect.top + rect.height / 2 - cardH / 2)),
      };
    case 'right':
      return {
        left: Math.min(vw - cardW - 16, rect.right + gap),
        top: Math.max(16, Math.min(vh - cardH - 16, rect.top + rect.height / 2 - cardH / 2)),
      };
    default:
      return {
        left: Math.max(16, Math.min(vw - cardW - 16, rect.left + rect.width / 2 - cardW / 2)),
        top: Math.min(vh - cardH - 16, rect.bottom + gap),
      };
  }
}
