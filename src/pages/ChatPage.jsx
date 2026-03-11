import React, { useEffect, useMemo, useState, useRef } from 'react';
import ChatInput from '@/components/ui/ChatInput';
import Header from '@/components/ui/Header';
import ChatContainer from '@/components/ui/ChatContainer';
import SettingsPanel from '@/components/ui/SettingsPanel';
import HistoryChat from '@/components/ui/HistoryChat';
import { useChatStore } from '@/stores/useChatStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { messageHandler } from '@/utils/messageHandler';
import { createChatCompletion } from '@/utils/api';
export default function ChatPage() {
  // 1.获取Store实例
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();

  // 本地状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 2.获取状态(Zustand状态直接可用)
  const isLoading = chatStore.isLoading;
  const conversations = chatStore.conversations;
  const currentId = chatStore.currentConversationId;

  // 派生状态(Derived State)
  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentId),
    [conversations, currentId],
  );

  const currentMessages = currentConversation?.messages || [];

  // title
  const currentTitle = useMemo(
    () => currentConversation?.title || 'LLM Chat',
    [currentConversation],
  );
  
  // Refs
  const messageContainerRef = useRef(null);

  // 4.自动滚动逻辑
  useEffect(() => {
    // 当消息列表变化或加载状态变化时，滚动到底部
    if (messageContainerRef.current) {
      setTimeout(() => {
        const container = messageContainerRef.current;
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, [currentMessages, isLoading]);

  // 挂载逻辑
  useEffect(() => {
    // 初始化检查
    if (conversations.length === 0) {
      chatStore.createConversation();
    }

    // 初始滚动
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 0);
    }
  }, []);

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
        )
      );

      //2.添加空的助手信息（占位）
      // 确保addMessage是异步等待完成
      await chatStore.addMessage(
        messageHandler.formatMessage('assistant', '', '', ''),
      );

      //3.设置loading状态
      chatStore.setIsLoading(true);

      //4.获取最后一条消息（刚创建的助手消息）并标记loading
      const lastMessage = chatStore.getLastMessage();
      if (lastMessage){
        // 建议通过store的方式更新
        lastMessage.loading = true;
      }

      console.log('2.Preparing API call');

      //准备API参数
      // 过滤不需要发送给后端的字段，只需要role和content
      const messagesPayload = currentMessages.map(
        ({ role, content }) => ({
          role,
          content,
        }),
      );

      // 获取当前的流式设置（关键修复：确保路径正确）
      const isStreamMode = settingsStore.settings?.stream ?? false;
      
      console.log('Calling API with stream mode:',isStreamMode);
      
      // 调用API
      const response = await createChatCompletion(messagesPayload);
      
      // 处理响应（流式或非流式）
      await messageHandler.handleResponse(
        response,
        isStreamMode,//使用正确的布尔值
        (content, resasoning_content, tokens, speed) => {
          chatStore.updateLastMessage(
            content,
            resasoning_content,
            tokens,
            speed,
          );
        },
      );
    } catch (error) {
      console.log('用户消息发送失败', error);
      // 错误处理：更新最后一条为错误提示
      chatStore.updateLastMessage('抱歉发现了错误，请稍后重试');
    } finally {
      // 重置Loading状态
      chatStore.setIsLoading(false);
      const lastMessage = chatStore.getLastMessage();
      if (lastMessage) lastMessage.loading = false;
      setIsSending(false);
    }
  };

  // 核心函数，重新生成
  const handleRegenerate = async () => {
    try {
      // 获取最后一条用户消息（倒数第二条）
      // 注意：确保数组长度足够，避免索引错误
      if (currentMessages.length < 2) return;
      const lastUserMessage = currentMessages[currentMessages.length - 2];

      // 删除最后两条消息（最后的助手消息和最后的用户消息
      // Zustand数组操作，建议调用store方法来splice，或者直接修改后通知（取决于Store实现）
      // 假设store有removeLastMessages方法，或者直接操作数组（如果使用Immer中间件）
      // 这里使用直接操作，需确保store支持porxy/immer
      chatStore.currentMessages.splice(-2, 2);

      // 重新发送
      await handleSendMessage({
        text: lastUserMessage.content,
        files: lastUserMessage.files || [],
      });
    } catch (error) {
      console.error('Failed to regenerate message:', error);
    }
  };

  // 新建对话
  const handleNewChat = () => {
    chatStore.createConversation();
  };

  // 格式化标题
  const formatTitle = (title) => {
    if (!title) return '';
    return title.length > 4 ? title.slice(0, 4) + '...' : title;
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
