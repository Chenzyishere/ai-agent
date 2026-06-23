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
  const conversations = useChatStore((s) => s.conversations);
  const currentId = useChatStore((s) => s.currentConversationId);
  const isLoading = useChatStore((s) => s.isLoading);
  const createConversation = useChatStore((s) => s.createConversation);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastMessage = useChatStore((s) => s.updateLastMessage);
  const getLastMessage = useChatStore((s) => s.getLastMessage);
  const removeLastMessages = useChatStore((s) => s.removeLastMessages);
  const setIsLoading = useChatStore((s) => s.setIsLoading);

  const settingsStore = useSettingsStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentId),
    [conversations, currentId],
  );

  const currentMessages = currentConversation?.messages || [];
  const currentTitle = currentConversation?.title || 'LLM Chat';

  const messageContainerRef = useRef(null);
  const scrollPendingRef = useRef(false);

  useEffect(() => {
    document.title = '聊天 - 知微AI对话平台';
  }, []);

  // 自动滚动 — 使用 rAF 防止流式输出时抖动
  useEffect(() => {
    if (!messageContainerRef.current || scrollPendingRef.current) return;
    scrollPendingRef.current = true;
    requestAnimationFrame(() => {
      const container = messageContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      scrollPendingRef.current = false;
    });
  }, [currentMessages, isLoading]);

  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []);

  const executeChatFlow = useCallback(
    async (text, files = [], isRegeneration = false) => {
      if (!text && (!files || files.length === 0)) return;
      setIsProcessing(true);
      try {
        if (!isRegeneration) {
          setIsLoading(true);
          await addMessage(
            messageHandler.formatMessage('user', text, '', files),
          );
          await addMessage(
            messageHandler.formatMessage('assistant', '', '', ''),
          );
        } else {
          setIsLoading(true);
          const lastMsg = getLastMessage();
          if (!lastMsg || lastMsg.role !== 'assistant') {
            addMessage(
              messageHandler.formatMessage('assistant', '', '', ''),
            );
          }
        }

        const freshMessages =
          useChatStore
            .getState()
            .conversations.find(
              (c) => c.id === useChatStore.getState().currentConversationId,
            )?.messages || [];

        const messagesPayload = freshMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(0, -1)
          .map(({ role, content }) => ({ role, content }));

        const isStreamMode = settingsStore.settings?.stream ?? false;

        const response = await createChatCompletion(messagesPayload);
        await messageHandler.handleResponse(
          response,
          isStreamMode,
          (content, reasoning, tokens, speed) => {
            updateLastMessage(content, reasoning, tokens, speed);
          },
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Chat flow failed:', error);
        updateLastMessage(
          `错误: ${error.message || '网络异常'}`,
          '',
          0,
          '0',
        );
      } finally {
        setIsProcessing(false);
        setIsLoading(false);
      }
    },
    [settingsStore.settings],
  );

  const handleNewMessage = (content) => {
    executeChatFlow(content.text, content.files, false);
  };

  const handleRegenerate = async () => {
    if (currentMessages.length < 2) return;
    const lastUserMsg = currentMessages[currentMessages.length - 2];
    removeLastMessages();
    await executeChatFlow(lastUserMsg.content, lastUserMsg.files || [], true);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-black via-pink-800 to-blue-800 bg-size-[200%_500%] filter"
      ></div>
      <div className="relative z-10 flex h-dvh w-full flex-col overflow-hidden">
        <Header
          isSettingsOpen={isSettingsOpen}
          isHistoryOpen={isHistoryOpen}
          toggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        />
        <main id="main-content" className="relative flex flex-1 w-full justify-center min-h-0">
          <div className="flex flex-1 w-full flex-col max-w-7xl mx-auto min-h-0">
            <ChatContainer
              messages={currentMessages}
              onRegenerate={handleRegenerate}
              containerRef={messageContainerRef}
            />
            <ChatInput loading={isProcessing} onSend={handleNewMessage} />
          </div>
          <HistoryChat
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            currentTitle={currentTitle}
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </main>
      </div>
    </>
  );
}
