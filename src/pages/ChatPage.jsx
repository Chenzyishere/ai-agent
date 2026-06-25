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
import ThemeBackground from '@/components/ui/ThemeBackground';

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

        const systemMsg = {
          role: 'system',
          content: `你是知微AI平台的智能助手。当前使用的模型是 ${settingsStore.settings?.model || 'AI大模型'}。请用中文回答，自称知微AI。`,
        };
        const messagesPayload = [
          systemMsg,
          ...freshMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .slice(0, -1)
            .map(({ role, content }) => ({ role, content })),
        ];

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

  const handleRegenerate = (assistantMsg) => {
    if (!assistantMsg || currentMessages.length < 2) return;
    const state = useChatStore.getState();
    const conv = state.conversations.find((c) => c.id === currentId);
    if (!conv) return;
    const msgs = conv.messages;
    const aiIndex = msgs.findIndex((m) => m.id === assistantMsg.id);
    if (aiIndex < 1) return;
    const userMsg = msgs[aiIndex - 1];
    if (userMsg.role !== 'user') return;
    // 删除该 AI 消息及之后的所有消息
    const keepMsgs = msgs.slice(0, aiIndex);
    useChatStore.setState((prev) => {
      const idx = prev.conversations.findIndex((c) => c.id === currentId);
      if (idx === -1) return prev;
      const newConvs = [...prev.conversations];
      newConvs[idx] = { ...newConvs[idx], messages: keepMsgs };
      return { conversations: newConvs };
    });
    executeChatFlow(userMsg.content, userMsg.files || [], true);
  };

  return (
    <>
      <ThemeBackground />
      <div className="relative z-10 flex h-dvh w-full flex-col overflow-hidden">
        <Header
          isSettingsOpen={isSettingsOpen}
          isHistoryOpen={isHistoryOpen}
          toggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          collapsible
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
