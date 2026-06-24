import React, { useState, useMemo, useEffect } from 'react';
import { useSettingsStore, providers, providerKeys, providerKeyLinks, backgroundPresets, backgroundKeys } from '@/stores/useSettingsStore';
import { X, Settings, HelpCircle, ExternalLink, Eye, EyeOff, ChevronDown } from 'lucide-react';

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-zinc-700 rounded-lg shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
        </div>
      )}
    </div>
  );
};

function RangeSlider({ value, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative flex-1 h-5 flex items-center">
      {/* 轨道未填充部分 */}
      <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/15" />
      {/* 轨道已填充部分 */}
      <div
        className="absolute left-0 h-1.5 rounded-full bg-purple-400"
        style={{ width: `${pct}%` }}
      />
      {/* 原生 range（透明覆盖，只暴露滑块） */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="relative w-full h-5 appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose }) {
  const { settings, updateSettings } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);

  const currentProvider = providers[settings.provider] || providers.siliconflow;
  const currentModels = currentProvider?.models || providers.siliconflow.models;
  const currentModelExists = currentModels.some((m) => m.value === settings.model);
  const activeModel = currentModelExists ? settings.model : currentModels[0].value;

  const currentMaxTokens = useMemo(() => {
    const m = currentModels.find((m) => m.value === activeModel);
    return m ? m.maxTokens : 4096;
  }, [activeModel, currentModels]);

  useEffect(() => {
    if (!currentModelExists) {
      updateSettings({ model: activeModel });
    }
  }, [currentModelExists, activeModel, updateSettings]);

  const handleProviderChange = (key) => {
    const defaultModel = providers[key].models[0].value;
    updateSettings({ provider: key, model: defaultModel, maxTokens: providers[key].models[0].maxTokens });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col w-full h-full border-white/15 bg-[#1e1640]/85 backdrop-blur-2xl shadow-2xl transition-all duration-300 md:inset-auto md:top-1/2 md:-translate-y-1/2 md:right-4 md:w-90 md:h-[60vh] md:max-h-[60vh] md:rounded-2xl md:border ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          对话设置
        </h2>
        <button onClick={onClose} className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 custom-scrollbar-thin">
        {/* 1. API 厂商 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white/80">API 厂商</span>
            <Tooltip content="选择大模型服务提供商">
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {providerKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleProviderChange(key)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  settings.provider === key
                    ? 'bg-purple-500/30 text-white ring-1 ring-purple-400/50'
                    : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70'
                }`}
              >
                {providers[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 模型选择 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white/80">模型</span>
            <Tooltip content={`${currentProvider.name} 提供的模型`}>
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
            </Tooltip>
          </div>
          <div className="relative">
            <select
              value={activeModel}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="w-full appearance-none rounded-lg border border-white/12 bg-white/8 text-white/90 py-2.5 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-shadow"
            >
              {currentModels.map((m) => (
                <option key={m.value} value={m.value} className="bg-zinc-800 text-white">
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* 背景主题 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white/80">背景主题</span>
            <Tooltip content="选择全局背景氛围">
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {backgroundKeys.map((key) => (
              <button
                key={key}
                onClick={() => updateSettings({ background: key })}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  settings.background === key
                    ? 'bg-purple-500/30 text-white ring-1 ring-purple-400/50'
                    : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70'
                }`}
              >
                {backgroundPresets[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 流式响应 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white/80">流式响应</span>
            <Tooltip content="实时逐字输出 AI 回复">
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
            </Tooltip>
          </div>
          <button
            role="switch"
            aria-checked={settings.stream}
            onClick={() => updateSettings({ stream: !settings.stream })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.stream ? 'bg-purple-500' : 'bg-white/15'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.stream ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* 4. API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80">API Key</span>
              <Tooltip content={`用于 ${currentProvider.name} 的身份验证`}>
                <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              </Tooltip>
            </div>
            <a href={providerKeyLinks[settings.provider] || providerKeyLinks.siliconflow} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              获取 Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full rounded-lg border border-white/12 bg-white/8 text-white/90 py-2.5 px-3 pr-10 text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
            <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-white/30">Key 仅保存在本地浏览器中</p>
        </div>

        {/* 5. Max Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80">Max Tokens</span>
              <Tooltip content="生成文本的最大长度">
                <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">{settings.maxTokens}</span>
          </div>
          <div className="flex items-center gap-3">
            <RangeSlider
              value={settings.maxTokens}
              min={1}
              max={currentMaxTokens}
              step={1}
              onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
            />
            <input type="number" min="1" max={currentMaxTokens}
              value={settings.maxTokens}
              onChange={(e) => updateSettings({ maxTokens: Math.min(Math.max(1, parseInt(e.target.value) || 1), currentMaxTokens) })}
              className="w-20 rounded-lg border border-white/12 bg-white/8 text-white/90 text-sm py-1.5 px-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
          <p className="text-xs text-white/30 text-right">最大: {currentMaxTokens}</p>
        </div>

        {/* 6. Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80">Temperature</span>
              <Tooltip content="越高越随机，越低越确定 (0-2)">
                <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">{settings.temperature.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <RangeSlider
              value={settings.temperature}
              min={0} max={2} step={0.1}
              onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
            />
            <input type="number" min="0" max="2" step="0.1" value={settings.temperature}
              onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) updateSettings({ temperature: Math.min(Math.max(0, v), 2) }); }}
              className="w-20 rounded-lg border border-white/12 bg-white/8 text-white/90 text-sm py-1.5 px-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>

        {/* 7. Top-P */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80">Top-P</span>
              <Tooltip content="核采样阈值 (0-1)">
                <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">{settings.topP.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <RangeSlider
              value={settings.topP}
              min={0} max={1} step={0.1}
              onChange={(e) => updateSettings({ topP: parseFloat(e.target.value) })}
            />
            <input type="number" min="0" max="1" step="0.1" value={settings.topP}
              onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) updateSettings({ topP: Math.min(Math.max(0, v), 1) }); }}
              className="w-20 rounded-lg border border-white/12 bg-white/8 text-white/90 text-sm py-1.5 px-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>

        {/* 8. Top-K */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80">Top-K</span>
              <Tooltip content="保留概率最高的 K 个词 (1-100)">
                <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">{settings.topK}</span>
          </div>
          <div className="flex items-center gap-3">
            <RangeSlider
              value={settings.topK}
              min={1} max={100} step={1}
              onChange={(e) => updateSettings({ topK: parseInt(e.target.value) })}
            />
            <input type="number" min="1" max="100" step="1" value={settings.topK}
              onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) updateSettings({ topK: Math.min(Math.max(1, v), 100) }); }}
              className="w-20 rounded-lg border border-white/12 bg-white/8 text-white/90 text-sm py-1.5 px-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
