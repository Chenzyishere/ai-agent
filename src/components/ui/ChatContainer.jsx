import React from 'react'
import MessageItem from '@/components/ui/MessageItem'
import { useChatStore } from '@/stores/useChatStore'
export default function ChatContainer() {
  // 1.从Zustand获取状态和方法

  // 获取当前会话的所有消息
  // 使用选择器避免不必要的重渲染
  const messages = useChatStore((state)=>{
    const currentConv = state.conversations.find(
      (c) => c.id === state.currentConversationId
    );
    return currentConv ? currentConv.messages : [];
  })

// --- 3. 渲染列表 ---
  return (
    <div className='h-full mt-28 mb-40 overflow-y-auto
     [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-none
            [&::-webkit-scrollbar-thumb]:bg-gray-700
            [&::-webkit-scrollbar-thumb]:rounded 
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    '>
      {/* 如果消息列表为空，显示欢迎语 */}
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-gray-400">
          <p>开始新的对话吧...</p>
        </div>
      ) : (
        <div className="px-4">
          {messages.map((msg, index) => {
            // 判断是否为最后一条 AI 消息
            // 条件：是当前索引 + 它是 assistant 角色 + 后面没有其他 assistant 消息了
            const isLastAssistant = 
              msg.role === 'assistant' && 
              index === messages.length - 1;

            return (
              <MessageItem
                key={msg.id || index} // 确保 key 唯一且稳定
                message={msg}
                isLastAssistantMessage={isLastAssistant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
