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
        messages: [],
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
    setIsLoading:(value) => set({isLoading:value}),

    // [消息管理] 更新最后一条消息（用于流式响应）
    updateLastMessage:(content,reasoning_content,completion_tokens,speed)=>{
        set((state) =>{
            const convIndex = state.conversations.findIndex(
                (c) => c.id === state.currentConversationId
            );

            if(convIndex === -1) return state;

            const conv = state.conversations[convIndex];
            if(!conv.messages || conv.messages.length ===0) return state;
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
            newConversations[convIndex] = {...conv,messages:newMessages};

            return {conversations:newConversations};
        });
    },

    // [消息管理] 获取最后一条消息(Helper)
    getLastMessage:() =>{
        const state = get();
        const conv = state.conversations.find(c=>c.id === state.currentConversationId);
        return conv?.messages?.length?conv.messages[conv.messages.length -1]:null;
    },

  })),
);
