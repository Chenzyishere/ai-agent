import React, { useState } from 'react';
import ChatInput from '@/components/ui/ChatInput';
import Header from '@/components/ui/Header';
import ChatContainer from '@/components/ui/ChatContainer';
import SettingsPanel from '@/components/ui/SettingsPanel';
import { Settings } from 'lucide-react';
import HistoryChat from '@/components/ui/HistoryChat';
import { useChatStore } from '@/stores/useChatStore';
import { messageHandler } from '@/utils/messageHandler';
messageHandler;
export default function ChatPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const chatStore = useChatStore();

  const handleSendMessage = async (messageContent) => {
    console.log('发送信息', messageContent);
    setIsSending(true);
    try {
      //1.添加用户信息，先用messageHandler format一下
      await chatStore.addMessage(
        messageHandler.formatMessage(
          'user',
          messageContent.text,
          '',
          messageContent.files,
        ),
      );
      //2.添加空的助手信息（占位）
      chatStore.addMessage(
        messageHandler.formatMessage('assistant', '', '', ''),
      );
      //3.设置loading状态
      chatStore.setIsLoading(true);
      //4.获取最后一条消息（刚创建的助手消息）并标记loading
      const lastMessage = chatStore.getLastMessage();
      if (lastMessage) lastMessage.loading = true;

      console.log('2.Preparing API call');
      //准备API参数
      // 过滤不需要发送给后端的字段，只需要role和content
      const messagesPayload = chatStore.currentMessages.map(({role,content})=>({
        role,
        content
      }))
    } catch (error) {
      console.log('用户消息发送失败', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* 1. 独立背景层：应用模糊和渐变 */}
      <div className="blur-7xl absolute inset-0 z-0 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-black via-pink-800 to-blue-800 bg-size-[200%_500%] filter"></div>
      <Header
        isSettingsOpen={isSettingsOpen}
        isHistoryOpen={isHistoryOpen}
        toggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
      />
      <div className="relative mx-auto flex w-screen justify-center gap-4">
        {/* 历史记录面板 */}
        <HistoryChat
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
        {/* 设置面板 */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <div className="flex h-screen w-3/5 flex-col">
          <ChatContainer />
          <ChatInput loading={isSending} onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
