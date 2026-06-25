import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  MessageSquare,
  Users,
  Settings,
  ShieldCheck,
  Copy,
  Check,
  Zap,
  Layers,
  Eye,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThemeBackground from '@/components/ui/ThemeBackground';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white/10 p-1.5 text-white/40 transition-all hover:bg-white/20 hover:text-white"
      title="复制"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

const sections = [
  {
    id: 'intro',
    title: '平台简介',
    icon: <BookOpen size={18} />,
    content: (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">欢迎来到知微 AI</h2>
        </div>
        <p className="text-base leading-relaxed text-white/70">
          知微 AI 对话平台是一个基于最新大语言模型技术的智能交互系统。它不仅支持流畅的自然语言对话，还具备自主任务规划、多模态理解等高级能力，旨在成为您工作与学习的得力助手。
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: <Zap size={22} />, title: '极速响应', desc: '毫秒级延迟，流畅如真人对话' },
            { icon: <Layers size={22} />, title: '自主代理', desc: '自动拆解任务，执行复杂工作流' },
            { icon: <Eye size={22} />, title: '多模态感知', desc: '看懂图片，听懂声音，全面理解' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.07]">
              <div className="mb-3 text-blue-400">{item.icon}</div>
              <h3 className="mb-1 font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'login',
    title: '登录与注册',
    icon: <Users size={18} />,
    content: (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">快速开始</h2>
        </div>
        <p className="text-base text-white/70">首次使用需要注册账号，我们提供测试账号供您快速体验所有功能。</p>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-3 flex items-center gap-3 text-lg font-semibold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">1</span>
              注册新账号
            </h3>
            <p className="mb-3 ml-10 text-white/60">点击登录页的"新用户注册"标签，填写信息即可。</p>
            <ul className="ml-10 space-y-1.5 text-sm text-white/50">
              <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> 用户名至少 3 个字符</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> 密码需包含至少 8 个字符</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> 邮箱需为有效格式</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-3 flex items-center gap-3 text-lg font-semibold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">2</span>
              测试账号（免注册）
            </h3>
            <p className="mb-4 ml-10 text-white/60">直接使用以下凭证登录体验：</p>
            <div className="ml-10 space-y-3">
              {[
                { label: 'Administrator', user: 'admin', pass: '123456789' },
                { label: 'Standard User', user: 'user', pass: '123456789' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/5 bg-[#1a1030]/60 p-3.5 font-mono text-sm">
                  <div className="mb-1 text-xs font-semibold tracking-wider text-white/30 uppercase">{item.label}</div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">
                      <span className="text-white/30">user</span> <code className="text-white">{item.user}</code>
                      <span className="mx-2 text-white/20">|</span>
                      <span className="text-white/30">pass</span> <code className="text-white">{item.pass}</code>
                    </span>
                    <CopyButton text={item.user} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'chat',
    title: '对话功能',
    icon: <MessageSquare size={18} />,
    content: (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">核心对话指南</h2>
        </div>
        <p className="text-base text-white/70">登录后，您将进入沉浸式对话界面。以下是高效使用知微 AI 的技巧：</p>
        <div className="space-y-3">
          {[
            { title: '1. 智能上下文', desc: '知微 AI 拥有超长记忆窗口。您可以直接说"把上面那段代码优化一下"或"总结一下刚才的观点"，它都能精准理解。', icon: <Layers size={20} className="text-blue-400" /> },
            { title: '2. 多模态输入', desc: '不仅支持文字，您还可以上传图片或文件，AI 将为您分析图表、提取文字或解释概念。', icon: <Eye size={20} className="text-purple-400" /> },
            { title: '3. 角色预设', desc: '在设置中切换 AI 的角色（如：资深程序员、创意作家、数据分析师），获得更专业的回答风格。', icon: <Users size={20} className="text-pink-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mt-0.5 shrink-0 rounded-lg bg-white/5 p-2">{item.icon}</div>
              <div>
                <h4 className="mb-1 font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-linear-to-r from-purple-500/10 to-blue-500/10 p-5">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Zap size={18} className="text-yellow-400" /> 专家提示
          </h4>
          <p className="text-sm text-white/60">
            提问公式：<strong className="text-white">背景 + 任务 + 约束</strong><br />
            例如："我是一名 Python 初学者（背景），请解释什么是装饰器（任务），请用简单的比喻且不超过 200 字（约束）。"
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'settings',
    title: '设置与安全',
    icon: <Settings size={18} />,
    content: (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
            <Settings size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">账户与安全</h2>
        </div>
        <p className="text-base text-white/70">我们高度重视您的数据隐私与安全。</p>
        <div className="space-y-3">
          {[
            { icon: <ShieldCheck size={20} className="text-green-400" />, title: '端到端隐私保护', desc: '您的对话数据仅在会话期间保留用于上下文记忆，会话结束后立即加密归档，绝不用于公共模型训练。' },
            { icon: <Settings size={20} className="text-blue-400" />, title: '个性化模型配置', desc: '调整温度值（Temperature）控制创造性，或设置最大令牌数以控制回答长度。' },
            { icon: <Users size={20} className="text-purple-400" />, title: '团队管理（企业版）', desc: '管理员可邀请成员、分配额度并查看团队使用分析报告。' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mt-0.5 shrink-0 rounded-lg bg-white/5 p-2">{item.icon}</div>
              <div>
                <h4 className="mb-1 font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DocPage() {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    document.title = '文档 - 知微AI对话平台';
  }, []);

  const current = sections.find((s) => s.id === activeSection);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black">
      {/* 统一背景 */}
      <ThemeBackground />

      <div className="relative z-10 flex flex-col h-dvh">
        <Header />

        <div className="flex-1 flex w-full max-w-full gap-8 px-4 pt-16 pb-4 sm:px-6 min-h-0 md:pt-20">
          {/* 左侧导航 (桌面端) */}
          <nav className="hidden w-48 shrink-0 md:block">
            <div className="space-y-1 pt-2">
              <div className="mb-4 px-3 text-xs font-semibold tracking-wider text-white/25 uppercase">导航</div>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                {s.icon}
                {s.title}
              </button>
            ))}
          </div>
        </nav>

        {/* 移动端 */}
        <div className="flex flex-col w-full md:hidden min-h-0">
          <div className="custom-scrollbar-thin -mx-1 mb-4 flex gap-1 overflow-x-auto shrink-0 px-1 pb-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-thin rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            {current?.content}
          </div>
        </div>

        {/* 桌面端内容 */}
        <div className="hidden md:block min-w-0 flex-1 min-h-0">
          <div className="h-full overflow-y-auto custom-scrollbar-thin rounded-2xl border border-white/10 bg-white/[0.03] p-8 lg:p-12">
            {current?.content}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
