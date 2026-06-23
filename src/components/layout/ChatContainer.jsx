import React, { useState, useEffect, useCallback } from 'react';
import MessageItem from '@/components/ui/MessageItem';

export default function ChatContainer({ messages, onRegenerate, containerRef }) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const el = containerRef?.current;
    if (el) setScrolled(el.scrollTop > 20);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!messages || messages.length === 0) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-white/80">开始新的对话</h2>
          <p className="text-white/40">发送消息以获取帮助</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        className="relative h-full overflow-y-auto px-4 pt-4 pb-30 custom-scrollbar-thin"
      >
        {/* 顶部 sticky 模糊 */}
        <div
          aria-hidden="true"
          className={`pointer-events-none sticky top-0 z-10 -mt-4 h-14 -mb-14 backdrop-blur transition-opacity duration-500 [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] mask-[linear-gradient(to_bottom,black,transparent)] ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {messages.map((msg, index) => {
          const isLastAssistant =
            msg.role === 'assistant' &&
            index === messages.length - 1 &&
            !msg.loading;

          return (
            <MessageItem
              key={msg.id}
              message={msg}
              isLastAssistantMessage={isLastAssistant}
              onRegenerate={onRegenerate}
            />
          );
        })}
      </div>
      {/* 底部 fixed 模糊 — 贴合视窗底部 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-15 h-36 backdrop-blur [-webkit-mask-image:linear-gradient(to_top,black_30%,black_70%,transparent)] mask-[linear-gradient(to_top,black_30%,black_70%,transparent)]"
      />
    </div>
  );
}
