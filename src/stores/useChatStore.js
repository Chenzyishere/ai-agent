//src/store/useChatStore.js
import { message } from 'antd';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useChatStore = create(
  persist((set, get) => ({
    // 1.初始状态(state)
    conversations: [
      {
        id: '1',
        title: '日常问候',
        messages: [
            {
              id: 'msg_1',
              role: 'user',
              content: '你好，我想把之前的 Pinia 项目重构为 Zustand，有什么建议吗？',
              timestamp: new Date(Date.now() - 100000).toISOString(),
            },
            {
              id: 'msg_2',
              role: 'assistant',
              content: '你好！Zustand 是一个非常棒的选择。它的 API 非常简洁，不需要像 Redux 那样写大量的样板代码。\n\n主要优势包括：\n1. **无需 Provider**：直接在组件中 hook 使用。\n2. **细粒度订阅**：组件只在自己关心的状态变化时重渲染。\n3. **中间件生态**：原生支持 `persist` 持久化。\n\n你需要我帮你重构具体的代码片段吗？',
              reasoning_content: '用户询问从 Pinia 迁移到 Zustand 的建议。需要对比两者的异同，强调 Zustand 的轻量级和 hooks 特性。列出 3-4 个核心优势。',
              completion_tokens: 128,
              speed: 45.5,
              timestamp: new Date(Date.now() - 90000).toISOString(),
            },
            {
              id: 'msg_3',
              role: 'user',
              content: '好的，请帮我看看这个 MessageItem 组件怎么写。',
              timestamp: new Date(Date.now() - 50000).toISOString(),
            },
            {
              id: 'msg_4',
              role: 'assistant',
              content: '没问题。这是基于 Zustand 的 `MessageItem` 组件方案...\n\n```jsx\nconst MessageItem = ({ message }) => {\n  return <div>{message.content}</div>\n}\n```\n\n注意要处理好 markdown 渲染和代码高亮。',
              loading: false,
              timestamp: new Date().toISOString(),
            },
          ],
        createdAt: Date.now(),
      },
    ],
    currentConversationId: '1',
    isLoading: false,

    // 2.Actions
    // 对话管理，创建新对话
    createConversation: () => {
      const newConversation = {
        id: Date.now().toString(),
        title: '日常问候',
        messages: [],
        createdAt: Date.now(),
      };

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id, //自动切换
      }));
    },

    // [对话管理] 切换对话
    switchConversation: (id) => set({ currentConversationId: id }),

    // [消息管理] 添加消息
    addMessage: (message) => {
      set((state) => {
        const convIndex = state.conversations.findIndex(
          (c) => c.id === state.currentConversationId,
        );
        //如果对话的标识是-1就返回状态state
        if (convIndex === -1) return state;

        const newConversations = [...state.conversations];
        const currentConv = newConversations[convIndex];

        newConversations[convIndex] = {
          ...currentConv,
          messages: [
            ...currentConv.messages,
            {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...message, //role,content等
            },
          ],
        };

        return { conversations: newConversations };
      });
    },

    // [状态管理] 设置加载状态
    setIsLoading: (value) => set({ isLoading: value }),

    // [消息管理] 更新最后一条消息（用于流式响应）
    updateLastMessage: (
      content,
      reasoning_content,
      completion_tokens,
      speed,
    ) => {
      set((state) => {
        const convIndex = state.conversations.findIndex(
          (c) => c.id === state.currentConversationId,
        );

        if (convIndex === -1) return state;

        const conv = state.conversations[convIndex];
        if (!conv.messages || conv.messages.length === 0) return state;
        // 不可变更新数组中的最后一个元素
        const newMessages = [...conv.messages];
        const lastMsgIndex = newMessages.length - 1;

        newMessages[lastMsgIndex] = {
          ...newMessages[lastMsgIndex],
          content,
          reasoning_content,
          completion_tokens,
          speed,
        };

        const newConversations = [...state.conversations];
        newConversations[convIndex] = { ...conv, messages: newMessages };

        return { conversations: newConversations };
      });
    },

    // [消息管理] 获取最后一条消息(Helper)
    getLastMessage: () => {
      const state = get();
      const conv = state.conversations.find(
        (c) => c.id === state.currentConversationId,
      );
      return conv?.messages?.length
        ? conv.messages[conv.messages.length - 1]
        : null;
    },

    // [对话维护] 更新标题
    updateConversationTitle: (id, newTitle) => {
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === id ? { ...c, title: newTitle } : c,
        ),
      }));
    },

    // [对话维护] 删除对话
    deleteConversation: (id) => {
      set((state) => {
        const index = state.conversations.findIndex((c) => c.id === id);
        if (index === -1) return state;
        const newConversations = state.conversations.filter((c) => c.id !== id);
        let newCurrentId = state.currentConversationId;

        // 逻辑复刻：如果删光了就创建一个新对话
        if (newConversations.length === 0) {
          const newConv = {
            id: Date.now().toString(),
            title: '日常问候',
            messages: [],
            createdAt: Date.now(),
          };
          newConversations.push(newConv);
          newCurrentId = newConv.id;
        }

        // 逻辑复刻：如果删的是当前，切换到第一个
        else if (id === state.currentConversationId) {
          newCurrentId = newConversations[0].id;
        }

        return {
          conversations: newConversations,
          currentConversationId: newCurrentId,
        };
      });
    },
  })),
  {
    name:'llm-chat-store',
    storage:createJSONStorage(()=> localStorage)
  }
);
