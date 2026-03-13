import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

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
        // 1. 如果不是重生成，需要先添加用户消息和空的 AI 占位符
        if (!isRegeneration) {
          await chatStore.addMessage(
            messageHandler.formatMessage('user', text, '', files),
          );
          await chatStore.addMessage(
            messageHandler.formatMessage('assistant', '', '', ''),
          );
        } else {
          // 如果是重生成，消息已经被 ChatContainer 删除了，只需要设置 Loading
          chatStore.setIsLoading(true);
          // 确保有一个空的 assistant 消息存在 (如果之前删除干净了，可能需要重新加一个占位，视你的 Store 逻辑而定)
          // 假设 prepareRegeneration 保留了 assistant 的占位或者我们这里补一个
          const lastMsg = chatStore.getLastMessage();
          if (!lastMsg || lastMsg.role !== 'assistant') {
            await chatStore.addMessage(
              messageHandler.formatMessage('assistant', '', '', ''),
            );
          } else {
            // 更新现有的最后一条为 loading 状态
            lastMsg.loading = true;
            lastMsg.content = ''; // 清空旧内容
            // 注意：直接修改 store 对象可能不会触发视图更新，最好用 updateLastMessage 重置
            chatStore.updateLastMessage('', '', 0, '0');
          }
        }

        // 2. 准备 Payload (获取最新的消息列表)
        // 注意：这里需要重新获取一次，因为上面可能添加了新消息
        const freshMessages =
          useChatStore
            .getState()
            .conversations.find(
              (c) => c.id === useChatStore.getState().currentConversationId,
            )?.messages || [];

        // 过滤出 role 和 content
        // 如果是重生成：User Message (已存在) -> Assistant (空).
        // 发送给 API 时，通常不包含最后那个空的 Assistant。
        const messagesPayload = freshMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(0, -1) // 去掉最后那个空的 assistant
          .map(({ role, content }) => ({ role, content }));

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
      } catch (error) {
        console.error('Chat flow failed:', error);
        chatStore.updateLastMessage(
          `错误: ${error.message || '网络异常'}`,
          '',
          0,
          '0',
        );
      } finally {
        chatStore.setIsLoading(false);
        // 清理最后一条消息的 loading 标记 (如果 store 里没有单独字段，可能需要手动更新)
        const lastMsg = chatStore.getLastMessage();
        if (lastMsg) {
          // 这里最好有一个专门的动作来停止 loading，或者直接依赖 updateLastMessage 的最终调用
          // 简单起见，我们假设 updateLastMessage 结束后 loading 自动结束，或者手动设为 false
          // 如果你的 store 里 loading 是独立字段：
          // chatStore.setMessageLoading(false);
        }
        setIsProcessing(false);
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
    // 注意：此时 text 是 lastUserMsg.content
    await executeChatFlow(lastUserMsg.content, lastUserMsg.files || [], true);
  };

  return (
    <>
          {/* 1. 独立背景层：应用模糊和渐变 */}
      <div className="h-screen w-screen blur-7xl absolute inset-0 z-0 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-black via-pink-800 to-blue-800 bg-size-[200%_500%] filter"></div>
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
          <ChatInput loading={isSending} onSend={handleNewMessage} />
        </div>
      </div>
    </div>
    </>
  );
}
