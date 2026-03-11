//src/stores/useChatStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useChatStore = create(
  persist((set, get) => ({
    // 1.初始状态(state)
    // 只存最基础的数据，不存任何可以通过计算得到的值
    conversations: [
      {
        id: '1',
        title: '日常问候',
        messages: [],
        createdAt: Date.now(),
      },
    ],
    currentConversationId: '1',
    isLoading: false,

    // 2.动作(Actions)
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

    // [对话管理] 设置加载状态
    setIsLoading:(loading) => set({isLoading:loading}),

    // [消息管理] 添加消息
    addMessage: (message) => {
      const {currentConversationId,conversations} = get();
      if(!currentConversationId) return;

      set({
        conversations:conversations.map((conversation)=>{
          if(conversation.id === currentConversationId){
            return {
              ...conversation,
              messages:[
                ...conversation.messages,
                {
                  id:Date.now(),
                  timestamp:new Date().toISOString(),
                  ...message,
                }
              ]
            };
          }
          return conversation;
        })
      })
    },

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

        const conversation = state.conversations[convIndex];
        if (!conversation.messages || conversation.messages.length === 0) return state;
        // 不可变更新数组中的最后一个元素
        const newMessages = [...conversation.messages];
        const lastMsgIndex = newMessages.length - 1;

        newMessages[lastMsgIndex] = {
          ...newMessages[lastMsgIndex],
          content,
          reasoning_content,
          completion_tokens,
          speed,
        };

        const newConversations = [...state.conversations];
        newConversations[convIndex] = { ...conversation, messages: newMessages };

        return { conversations: newConversations };
      });
    },


    // [消息管理] 获取最后一条消息(Helper)
    getLastMessage: () => {
      const state = get();
      const conversation = state.conversations.find(
        (c) => c.id === state.currentConversationId,
      );
      return conversation?.messages?.length
        ? conversation.messages[conversation.messages.length - 1]
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
