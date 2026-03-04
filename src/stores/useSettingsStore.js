//src/stores/settingsStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


// api:sk-kbzcwxapqsoatnunquhjtsktakvxbkzplshufbicjyrulppj
export const useSettingsStore = create(
  persist((set) => ({
    // State:设置对象
    settings:{
      model:'deepseek-ai/DeepSeek-R1',
      apiKey:'',
      stream:true,
      maxTokens:4096,
      temperature:0.7,
      topP:0.7,
      topK:50
    },

    // Actions:更新部分设置
    updateSettings:(newSettings) =>
      set((state) =>({
        settings:{...state.settings,...newSettings}
      })),

    // Actions:重置设置（可选）
    resetSettings:()=>
      set({
          settings: {
            model: 'deepseek-ai/DeepSeek-R1',
            apiKey: '',
            stream: true,
            maxTokens: 4096,
            temperature: 0.7,
            topP: 0.7,
            topK: 50,
          },
      })
   })
),  {
    name:'llm-chat-store',//这个是localStorage中的key
    storage:createJSONStorage(()=> localStorage)
  })

// 模型选择常量（保持不变）
export const modelOptions = [
  {
    label: 'DeepSeek-R1',
    value: 'deepseek-ai/DeepSeek-R1',
    maxTokens: 16384,
  },
  {
    label: 'DeepSeek-V3',
    value: 'deepseek-ai/DeepSeek-V3',
    maxTokens: 4096,
  },
  {
    label: 'DeepSeek-V2.5',
    value: 'deepseek-ai/DeepSeek-V2.5',
    maxTokens: 4096,
  },
  {
    label: 'Qwen2.5-72B-Instruct-128K',
    value: 'Qwen/Qwen2.5-72B-Instruct-128K',
    maxTokens: 4096,
  },
  {
    label: 'QwQ-32B-Preview',
    value: 'Qwen/QwQ-32B-Preview',
    maxTokens: 8192,
  },
  {
    label: 'glm-4-9b-chat',
    value: 'THUDM/glm-4-9b-chat',
    maxTokens: 4096,
  },
  {
    label: 'glm-4-9b-chat(Pro)',
    value: 'Pro/THUDM/glm-4-9b-chat',
    maxTokens: 4096,
  },
];