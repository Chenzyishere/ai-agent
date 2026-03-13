import React from 'react';
import MessageItem from '@/components/ui/MessageItem';

export default function ChatContainer({ messages, onRegenerate, containerRef }) {
  if (!messages || messages.length === 0) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">开始新的对话</h2>
          <p>发送消息以获取帮助</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pt-20 pb-30 flex-1 overflow-y-auto px-4 py-6 custom-scrollbar-thin">
      {messages.map((msg, index) => {
        const isLastAssistant = 
          msg.role === 'assistant' && 
          index === messages.length - 1 && 
          !msg.loading; // 只有非加载状态的最后一条 AI 消息才能重生成

        return (
          <MessageItem
            key={msg.id || index}
            message={msg}
            isLastAssistantMessage={isLastAssistant}
            onRegenerate={onRegenerate} // 直接透传 Page 提供的 handler
          />
        );
      })}
    </div>
  );
}