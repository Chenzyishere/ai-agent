import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import Header from '@/components/layout/Header';
import SettingsPanel from '@/components/layout/SettingsPanel';
import ChatInput from '@/components/layout/ChatInput';
import ChatContainer from '@/components/layout/ChatContainer';
import HistoryChat from '@/components/layout/HistoryChat';
import { useChatStore } from '@/stores/useChatStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { messageHandler } from '@/utils/messageHandler';
import { createChatCompletion } from '@/services/api';
export default function ChatPage() {
  // 1.获取Store实例
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();
  // 本地状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 2.获取状态(Zustand状态直接可用)
  const conversations = chatStore.conversations;
  const currentId = chatStore.currentConversationId;

  // 派生状态(Derived State)
  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentId),
    [conversations, currentId],
  );

  const currentMessages = currentConversation?.messages || [];
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
  }, [currentMessages, chatStore.isLoading]);

  // 初始化
  useEffect(() => {
    if (conversations.length === 0) {
      chatStore.createConversation();
    }
  }, []);

  /**
   * 🌟 核心执行器：统一的聊天逻辑
   * 无论是“新发送”还是“重新生成”，都调用这个函数
   * @param {string} text - 要发送的文本
   * @param {Array} files - 文件列表
   * @param {boolean} isRegeneration - 是否是重生成模式（用于区分是否要先加用户消息）
   */
  const executeChatFlow = useCallback(
    async (text, files = [], isRegeneration = false) => {
      if (!text && (!files || files.length === 0)) return;
      setIsProcessing(true);
      try {
        // 1. 处理消息占位
        // 如果不是重置信息
        if (!isRegeneration) {
          chatStore.setIsLoading(true);
          await chatStore.addMessage(
            messageHandler.formatMessage('user', text, '', files),
          );
          await chatStore.addMessage(
            messageHandler.formatMessage('assistant', '', '', ''),
          );
        } else {
          chatStore.setIsLoading(true);
          const lastMsg = chatStore.getLastMessage();
          if (!lastMsg || lastMsg.role !== 'assistant') {
            chatStore.addMessage(
              messageHandler.formatMessage('assistant', '', '', ''),
            );
          }
        }

        // 2. 准备 Payload(上下文组装)
        // 获取现在的conversations messages，构建历史上下文
        const freshMessages =
          useChatStore
            .getState()
            .conversations.find(
              (c) => c.id === useChatStore.getState().currentConversationId,
            )?.messages || []; //提取消息列表，如果没有就是空数组

        // 切片
        // 1.保留有效角色
        // 2.去掉最后一条
        // 3.只保留role和content
        const messagesPayload = freshMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(0, -1)
          .map(({ role, content }) => ({ role, content }));
        // 获取现在在的流式模式
        const isStreamMode = settingsStore.settings?.stream ?? false;

        // 3. 调用 API
        const response = await createChatCompletion(messagesPayload);
        // 4. 处理响应
        await messageHandler.handleResponse(
          response,
          isStreamMode,
          (content, reasoning, tokens, speed) => {
            chatStore.updateLastMessage(content, reasoning, tokens, speed);
          },
        );
        chatStore.setIsLoading(false);
      } catch (error) {
        chatStore.setIsLoading(false);
        console.error('Chat flow failed:', error);
        chatStore.updateLastMessage(
          `错误: ${error.message || '网络异常'}`,
          '',
          0,
          '0',
        );
      } finally {
        setIsProcessing(false);
        chatStore.setIsLoading(false);
      }
    },
    [settingsStore.settings],
  );

  // --- 传递给子组件的 Handlers ---
  // 给 ChatInput 用：普通发送
  const handleNewMessage = (content) => {
    executeChatFlow(content.text, content.files, false);
  };

  // 给 ChatContainer 用：重新生成
  const handleRegenerate = async () => {
    if (currentMessages.length < 2) return;
    // 1. 获取倒数第二条（用户消息）
    const lastUserMsg = currentMessages[currentMessages.length - 2];
    // 2. 调用 Store 删除最后一条消息 (旧 AI消息)
    chatStore.removeLastMessages();
    // 3. 触发执行器 (标记为重生成模式)
    await executeChatFlow(lastUserMsg.content, lastUserMsg.files || [], true);
  };

  return (
    <>
      {/* 1. 独立背景层：应用模糊和渐变 */}
      <div className="blur-7xl absolute inset-0 z-0 h-screen w-screen animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-black via-pink-800 to-blue-800 bg-size-[200%_500%] filter"></div>
      <div className="flex h-screen w-screen flex-col">
        <Header
          isSettingsOpen={isSettingsOpen}
          isHistoryOpen={isHistoryOpen}
          toggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        />
        <div className="relative mx-auto flex w-screen justify-center">
          {/* 历史记录面板 */}
          <HistoryChat
            isOpen={isHistoryOpen}
            onClose={() => {
              console.log('onClose被调用');
              setIsHistoryOpen(false);
            }}
            currentTitle={currentTitle}
          />
          {/* 设置面板 */}
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />

          <div className="flex h-screen w-full flex-col md:w-3/5">
            <ChatContainer
              messages={currentMessages}
              onRegenerate={handleRegenerate}
              containerRef={messageContainerRef}
            />
            <ChatInput loading={isProcessing} onSend={handleNewMessage} />
          </div>
        </div>
      </div>
    </>
  );
}
