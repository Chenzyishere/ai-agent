import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const providers = {
  siliconflow: {
    name: 'SiliconFlow',
    label: '硅基流动',
    baseURL: 'https://api.siliconflow.cn/v1',
    format: 'openai',
    models: [
      { label: 'DeepSeek-R1', value: 'deepseek-ai/DeepSeek-R1', maxTokens: 16384 },
      { label: 'DeepSeek-V3', value: 'deepseek-ai/DeepSeek-V3', maxTokens: 16384 },
      { label: 'DeepSeek-V3.1', value: 'deepseek-ai/DeepSeek-V3.1', maxTokens: 16384 },
      { label: 'DeepSeek-V3.1-Terminus', value: 'deepseek-ai/DeepSeek-V3.1-Terminus', maxTokens: 16384 },
      { label: 'Qwen3-235B-A22B', value: 'Qwen/Qwen3-235B-A22B', maxTokens: 16384 },
      { label: 'Qwen3-32B', value: 'Qwen/Qwen3-32B', maxTokens: 16384 },
      { label: 'Qwen3-30B-A3B', value: 'Qwen/Qwen3-30B-A3B', maxTokens: 16384 },
      { label: 'Qwen3-Next-80B-A3B', value: 'Qwen/Qwen3-Next-80B-A3B-Instruct', maxTokens: 16384 },
      { label: 'Qwen2.5-72B-Instruct-128K', value: 'Qwen/Qwen2.5-72B-Instruct-128K', maxTokens: 8192 },
      { label: 'QwQ-32B', value: 'Qwen/QwQ-32B', maxTokens: 16384 },
      { label: 'GLM-4-9B-Chat', value: 'THUDM/glm-4-9b-chat', maxTokens: 8192 },
      { label: 'GLM-Z1-32B-0414', value: 'zai-org/GLM-Z1-32B-0414', maxTokens: 16384 },
      { label: 'Kimi-K2-Instruct', value: 'moonshotai/Kimi-K2-Instruct', maxTokens: 16384 },
      { label: 'Llama-4-Maverick-17B', value: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct', maxTokens: 16384 },
      { label: 'Llama-4-Scout-17B', value: 'meta-llama/Llama-4-Scout-17B-16E-Instruct', maxTokens: 16384 },
    ],
  },
  deepseek: {
    name: 'DeepSeek',
    label: 'DeepSeek',
    baseURL: 'https://api.deepseek.com',
    format: 'openai',
    models: [
      { label: 'DeepSeek-V4-Flash', value: 'deepseek-v4-flash', maxTokens: 65536 },
      { label: 'DeepSeek-V4-Pro', value: 'deepseek-v4-pro', maxTokens: 65536 },
      { label: 'DeepSeek-V3.1 Chat (将弃用)', value: 'deepseek-chat', maxTokens: 65536 },
      { label: 'DeepSeek-R1 (将弃用)', value: 'deepseek-reasoner', maxTokens: 65536 },
    ],
  },
  deepseek_anthropic: {
    name: 'DeepSeek (Anthropic)',
    label: 'DeepSeek(A)',
    baseURL: 'https://api.deepseek.com/anthropic',
    format: 'anthropic',
    models: [
      { label: 'DeepSeek-V4-Flash', value: 'deepseek-v4-flash', maxTokens: 65536 },
      { label: 'DeepSeek-V4-Pro', value: 'deepseek-v4-pro', maxTokens: 65536 },
      { label: 'DeepSeek-V3.1 Chat', value: 'deepseek-chat', maxTokens: 65536 },
      { label: 'DeepSeek-R1', value: 'deepseek-reasoner', maxTokens: 65536 },
    ],
  },
  gemini: {
    name: 'Gemini',
    label: 'Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    format: 'gemini',
    models: [
      { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash', maxTokens: 65536 },
      { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro', maxTokens: 65536 },
      { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash', maxTokens: 16384 },
      { label: 'Gemini 2.0 Flash-Lite', value: 'gemini-2.0-flash-lite', maxTokens: 16384 },
    ],
  },
  openai: {
    name: 'OpenAI',
    label: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    format: 'openai',
    models: [
      { label: 'GPT-4.1', value: 'gpt-4.1', maxTokens: 32768 },
      { label: 'GPT-4.1-mini', value: 'gpt-4.1-mini', maxTokens: 32768 },
      { label: 'GPT-4.1-nano', value: 'gpt-4.1-nano', maxTokens: 32768 },
      { label: 'GPT-4o', value: 'gpt-4o', maxTokens: 16384 },
      { label: 'GPT-4o-mini', value: 'gpt-4o-mini', maxTokens: 16384 },
      { label: 'o4-mini', value: 'o4-mini', maxTokens: 16384 },
      { label: 'o3', value: 'o3', maxTokens: 16384 },
      { label: 'o3-mini', value: 'o3-mini', maxTokens: 16384 },
      { label: 'o1', value: 'o1', maxTokens: 16384 },
      { label: 'o1-mini', value: 'o1-mini', maxTokens: 16384 },
    ],
  },
  moonshot: {
    name: 'Moonshot',
    label: '月之暗面',
    baseURL: 'https://api.moonshot.cn/v1',
    format: 'openai',
    models: [
      { label: 'Kimi-K2', value: 'kimi-k2-0905-preview', maxTokens: 32768 },
      { label: 'Kimi-K1.5', value: 'kimi-k1.5-preview', maxTokens: 32768 },
      { label: 'Moonshot-v1-8K', value: 'moonshot-v1-8k', maxTokens: 8192 },
      { label: 'Moonshot-v1-32K', value: 'moonshot-v1-32k', maxTokens: 32768 },
      { label: 'Moonshot-v1-128K', value: 'moonshot-v1-128k', maxTokens: 131072 },
    ],
  },
  zhipu: {
    name: 'ZhipuAI',
    label: '智谱AI',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    format: 'openai',
    models: [
      { label: 'GLM-4-Plus', value: 'glm-4-plus', maxTokens: 16384 },
      { label: 'GLM-4-Air', value: 'glm-4-air', maxTokens: 16384 },
      { label: 'GLM-4-AirX', value: 'glm-4-airx', maxTokens: 16384 },
      { label: 'GLM-4-Flash', value: 'glm-4-flash', maxTokens: 16384 },
      { label: 'GLM-4-Long', value: 'glm-4-long', maxTokens: 131072 },
      { label: 'GLM-Z1-AirX', value: 'GLM-Z1-AirX', maxTokens: 16384 },
    ],
  },
};

export const providerKeys = Object.keys(providers);

export const providerKeyLinks = {
  siliconflow: 'https://cloud.siliconflow.cn/account/ak',
  deepseek: 'https://platform.deepseek.com/api_keys',
  openai: 'https://platform.openai.com/api-keys',
  moonshot: 'https://platform.moonshot.cn/console/api-keys',
  zhipu: 'https://open.bigmodel.cn/usercenter/apikeys',
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      settings: {
        provider: 'siliconflow',
        model: 'deepseek-ai/DeepSeek-R1',
        apiKey: '',
        stream: true,
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.7,
        topK: 50,
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () =>
        set({
          settings: {
            provider: 'siliconflow',
            model: 'deepseek-ai/DeepSeek-R1',
            apiKey: '',
            stream: true,
            maxTokens: 4096,
            temperature: 0.7,
            topP: 0.7,
            topK: 50,
          },
        }),
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...(persisted?.settings || {}),
        },
      }),
    },
  ),
);
