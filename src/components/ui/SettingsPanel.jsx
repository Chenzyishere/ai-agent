import React, { useState, useEffect, useMemo,useRef } from 'react';
import { useSettingsStore, modelOptions } from '@/stores/useSettingsStore';
import { 
  X, 
  Settings, 
  HelpCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  ChevronDown 
} from 'lucide-react';

/**
 * 通用 Tooltip 组件 (简单实现)
 */
const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

/**
 * 设置面板组件
 * @param {boolean} isOpen - 控制显示
 * @param {function} onClose - 关闭回调
 */
const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);

  // 计算当前选中模型的最大 tokens
  const currentMaxTokens = useMemo(() => {
    const selectedModel = modelOptions.find((opt) => opt.value === settings.model);
    return selectedModel ? selectedModel.maxTokens : 4096;
  }, [settings.model]);

  // 监听模型变化，自动调整 maxTokens
  useEffect(() => {
    const selectedModel = modelOptions.find((opt) => opt.value === settings.model);
    if (selectedModel && settings.maxTokens > selectedModel.maxTokens) {
      updateSettings({ maxTokens: selectedModel.maxTokens });
    }
  }, [settings.model, settings.maxTokens, updateSettings]);


  return (
    <>      
      {/* 抽屉面板 */}
      <div 
        className={`fixed top-1/6 right-0 h-1/2 w-1/7 overflow-hidden rounded-2xl border border-white/30 bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0 right-2' : 'translate-x-full'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            设置
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区域 (可滚动) */}
        <div className="flex-1 overflow-y-auto px-2 pt-10 space-y-6 h-full      [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-none
            [&::-webkit-scrollbar-thumb]:bg-gray-700
            [&::-webkit-scrollbar-thumb]:rounded 
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
          
          {/* 1. 模型选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              Model
              <Tooltip content="选择要使用的 LLM 模型">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="relative">
              <select
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
              >
                {modelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 2. 流式响应 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-700">流式响应</span>
              <Tooltip content="开启后将流式输出 AI 的回复">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            {/* 自定义 Switch */}
            <button
              role="switch"
              aria-checked={settings.stream}
              onClick={() => updateSettings({ stream: !settings.stream })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings.stream ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.stream ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 3. API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">API Key</span>
                <Tooltip content="您的 SiliconFlow API Key">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <a 
                href="https://cloud.siliconflow.cn/account/ak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                获取 Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">Key 仅保存在本地浏览器中</p>
          </div>

          {/* 4. Max Tokens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">Max Tokens</span>
                <Tooltip content="生成文本的最大长度">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {settings.maxTokens}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={currentMaxTokens}
                step="1"
                value={settings.maxTokens}
                onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="1"
                max={currentMaxTokens}
                value={settings.maxTokens}
                onChange={(e) => updateSettings({ maxTokens: Math.min(Math.max(1, parseInt(e.target.value) || 1), currentMaxTokens) })}
                className="w-20 bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
            <div className="text-xs text-gray-400 text-right">
              最大限制: {currentMaxTokens}
            </div>
          </div>

          {/* 5. Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">Temperature</span>
                <Tooltip content="值越高，回答越随机 (0-2)">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    updateSettings({ temperature: Math.min(Math.max(0, val), 2) });
                  }
                }}
                className="w-20 bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
          </div>

          {/* 6. Top-P */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">Top-P</span>
                <Tooltip content="核采样阈值 (0-1)">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {settings.topP.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => updateSettings({ topP: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    updateSettings({ topP: Math.min(Math.max(0, val), 1) });
                  }
                }}
                className="w-20 bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
          </div>

          {/* 7. Top-K */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">Top-K</span>
                <Tooltip content="保留概率最高的 K 个词 (1-100)">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {settings.topK}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={settings.topK}
                onChange={(e) => updateSettings({ topK: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={settings.topK}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    updateSettings({ topK: Math.min(Math.max(1, val), 100) });
                  }
                }}
                className="w-20 bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SettingsPanel;