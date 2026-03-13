import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  MessageSquare,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Search,
  Copy,
  Check,
  Zap,
  Layers,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
// --- 文档数据配置 ---
const docSections = [
  {
    id: 'intro',
    title: '平台简介',
    icon: <BookOpen size={20} />,
    content: (
      <>
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-blue-300 shadow-lg backdrop-blur-md">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            欢迎来到知微 AI
          </h2>
        </div>

        <p className="mb-8 text-lg leading-relaxed font-light text-gray-300">
          知微 AI
          对话平台是一个基于最新大语言模型技术的智能交互系统。它不仅支持流畅的自然语言对话，还具备自主任务规划、多模态理解等高级能力，旨在成为您工作与学习的得力助手。
        </p>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <Zap size={24} />,
              title: '极速响应',
              desc: '毫秒级延迟，流畅如真人对话',
            },
            {
              icon: <Layers size={24} />,
              title: '自主代理',
              desc: '自动拆解任务，执行复杂工作流',
            },
            {
              icon: <Eye size={24} />,
              title: '多模态感知',
              desc: '看懂图片，听懂声音，全面理解',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
            >
              <div className="mb-4 text-blue-400 transition-colors group-hover:text-blue-300">
                {item.icon}
              </div>
              <h3 className="mb-2 font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'login',
    title: '登录与注册',
    icon: <Users size={20} />,
    content: (
      <>
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-purple-300 shadow-lg backdrop-blur-md">
            <Users size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            快速开始
          </h2>
        </div>

        <p className="mb-8 font-light text-gray-300">
          首次使用需要注册账号，我们提供测试账号供您快速体验所有功能。
        </p>

        <div className="space-y-6">
          {/* 步骤 1 */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-sm font-bold text-white shadow-lg">
                1
              </span>
              注册新账号
            </h3>
            <p className="mb-4 ml-11 font-light text-gray-400">
              点击登录页的“新用户注册”标签，填写信息即可。
            </p>
            <ul className="ml-11 space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400" /> 用户名至少 3
                个字符
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400" /> 密码需包含至少 8
                个字符
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-400" /> 邮箱需为有效格式
              </li>
            </ul>
          </div>

          {/* 步骤 2 */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>

            <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-sm font-bold text-white shadow-lg">
                2
              </span>
              测试账号 (免注册)
            </h3>
            <p className="mb-4 ml-11 font-light text-gray-400">
              直接使用以下凭证登录体验：
            </p>

            <div className="ml-11 space-y-4">
              {/* 管理员 */}
              <div className="group relative rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-sm">
                <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase">
                  Administrator
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-300">
                    User: <span className="font-bold text-white">admin</span>
                  </span>
                  <CopyButton text="admin" id="admin-user" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    Pass:{' '}
                    <span className="font-bold text-white">123456789</span>
                  </span>
                  <CopyButton text="123456789" id="admin-pass" />
                </div>
              </div>

              {/* 普通用户 */}
              <div className="group relative rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-sm">
                <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase">
                  Standard User
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-300">
                    User: <span className="font-bold text-white">user</span>
                  </span>
                  <CopyButton text="user" id="user-user" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    Pass:{' '}
                    <span className="font-bold text-white">123456789</span>
                  </span>
                  <CopyButton text="123456789" id="user-pass" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'chat',
    title: '对话功能',
    icon: <MessageSquare size={20} />,
    content: (
      <>
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-green-300 shadow-lg backdrop-blur-md">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            核心对话指南
          </h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="mb-8 text-lg font-light text-gray-300">
            登录后，您将进入沉浸式对话界面。以下是高效使用知微 AI 的技巧：
          </p>

          <div className="grid gap-6">
            <FeatureCard
              title="1. 智能上下文"
              desc="知微 AI 拥有超长记忆窗口。您可以直接说‘把上面那段代码优化一下’或‘总结一下刚才的观点’，它都能精准理解。"
              icon={<Layers className="text-blue-400" />}
            />
            <FeatureCard
              title="2. 多模态输入"
              desc="不仅支持文字，您还可以上传图片或文件（取决于版本），AI 将为您分析图表、提取文字或解释概念。"
              icon={<Eye className="text-purple-400" />}
            />
            <FeatureCard
              title="3. 角色预设"
              desc="在设置中切换 AI 的角色（如：资深程序员、创意作家、数据分析师），获得更专业的回答风格。"
              icon={<Users className="text-pink-400" />}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 backdrop-blur-sm">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
              <Zap size={18} className="text-yellow-400" />
              专家提示
            </h4>
            <p className="text-sm leading-relaxed text-gray-300">
              提问公式：
              <strong className="text-white">背景 + 任务 + 约束</strong>。<br />
              例如：“我是一名 Python
              初学者（背景），请解释什么是装饰器（任务），请用简单的比喻且不超过
              200 字（约束）。”
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'settings',
    title: '设置与安全',
    icon: <Settings size={20} />,
    content: (
      <>
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-orange-300 shadow-lg backdrop-blur-md">
            <Settings size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            账户与安全
          </h2>
        </div>

        <p className="mb-8 font-light text-gray-300">
          我们高度重视您的数据隐私与安全。
        </p>

        <div className="space-y-4">
          <SecurityItem
            icon={<ShieldCheck className="text-green-400" />}
            title="端到端隐私保护"
            desc="您的对话数据仅在会话期间保留用于上下文记忆，会话结束后立即加密归档，绝不用于公共模型训练。"
          />
          <SecurityItem
            icon={<Settings className="text-blue-400" />}
            title="个性化模型配置"
            desc="调整温度值（Temperature）控制创造性，或设置最大令牌数以控制回答长度。"
          />
          <SecurityItem
            icon={<Users className="text-purple-400" />}
            title="团队管理 (企业版)"
            desc="管理员可邀请成员、分配额度并查看团队使用分析报告。"
          />
        </div>
      </>
    ),
  },
  {
    id: 'back',
    title: '返回主页',
    icon: <Menu size={20} />,
    content: (
      <>
      <Link to="/">
        <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
          
            <h3 className="text-center font-bold text-white">
              点击此处返回主页
            </h3>
        </div>
        </Link>
      </>
    ),
  },
];

// --- 子组件：复制按钮 ---
function CopyButton({ text, id }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white/5 p-1.5 text-gray-400 transition-all hover:bg-white/20 hover:text-white active:scale-95"
      title="复制"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

// --- 子组件：功能卡片 ---
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
      <div className="mt-1 shrink-0 rounded-lg bg-white/5 p-2">{icon}</div>
      <div>
        <h4 className="mb-1 font-semibold text-white">{title}</h4>
        <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

// --- 子组件：安全项 ---
function SecurityItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20">
      <div className="shrink-0 rounded-lg bg-white/5 p-2">{icon}</div>
      <div>
        <h4 className="mb-1 font-semibold text-white">{title}</h4>
        <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

export default function DocPage() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动以改变头部样式
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切换章节时滚动到顶部并关闭移动菜单
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  const currentContent = docSections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-200 selection:bg-purple-500/30 selection:text-white">
      {/* --- 动态背景层 (液态光晕) --- */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* 主光晕 */}
        <div className="animate-pulse-slow absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-purple-900/30 blur-[120px]"></div>
        <div className="animate-pulse-slow absolute right-[-10%] bottom-[-10%] h-[60vw] w-[60vw] rounded-full bg-blue-900/20 blur-[120px] delay-1000"></div>
        {/* 流动光带 */}
        <div className="animate-float absolute top-[20%] right-[10%] h-[30vw] w-[30vw] rounded-full bg-cyan-900/20 blur-[100px]"></div>
        <div className="animate-float absolute bottom-[30%] left-[20%] h-[40vw] w-[40vw] rounded-full bg-indigo-900/20 blur-[100px] delay-2000"></div>
        {/* 网格纹理叠加 (可选，增加质感) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay brightness-100 contrast-150"></div>
      </div>

      {/* --- 移动端顶部栏 --- */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 border-b transition-all duration-300 md:hidden ${scrolled ? 'border-white/10 bg-slate-950/80 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-xl font-bold text-white drop-shadow-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <BookOpen size={18} />
            </div>
            知微文档
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col pt-16 md:flex-row md:pt-0">
        {/* --- 左侧侧边栏 (玻璃导航) --- */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out md:relative md:sticky md:top-0 md:h-screen md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
        >
          {/* 侧边栏背景：磨砂玻璃 */}
          <div className="absolute inset-0 border-r border-white/10 bg-slate-900/60 backdrop-blur-2xl"></div>

          <div className="relative flex h-full flex-col">
            {/* Logo 区 (桌面端显示) */}
            <div className="hidden items-center gap-3 p-8 pb-6 md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
                <BookOpen size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide text-white">
                  知微 AI
                </h1>
                <p className="text-xs font-medium text-gray-400">
                  Help Center v2.0
                </p>
              </div>
            </div>

            {/* 导航列表 */}
            <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                导航
              </div>
              {docSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'border border-white/10 bg-white/10 text-white shadow-inner shadow-white/5'
                      : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                  } `}
                >
                  <span
                    className={`transition-colors ${activeSection === section.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                  >
                    {section.icon}
                  </span>
                  {section.title}
                  {activeSection === section.id && (
                    <ChevronRight className="ml-auto h-4 w-4 text-blue-400" />
                  )}
                </button>
              ))}

              <div className="mt-4 border-t border-white/5 px-4 pt-8">
                <div className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  更多资源
                </div>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
                  API 文档
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
                  社区论坛
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
                  联系支持
                </a>
              </div>
            </nav>

            {/* 底部用户状态 (模拟) */}
            <div className="border-t border-white/5 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-xs font-bold text-white">
                  U
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    User Demo
                  </p>
                  <p className="truncate text-xs text-gray-500">Free Plan</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- 遮罩层 (移动端) --- */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* --- 右侧主要内容区 --- */}
        <main className="relative min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 md:py-16 lg:px-12">
            {/* 顶部搜索栏 (玻璃态) */}
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="opacity-50">Documentation</span>
                <ChevronRight size={14} className="opacity-50" />
                <span className="font-medium text-blue-400">
                  {currentContent?.title}
                </span>
              </div>

              <div className="group relative w-full sm:w-72">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search
                    size={16}
                    className="text-gray-500 transition-colors group-focus-within:text-blue-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="搜索文档..."
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 内容卡片 (液态玻璃效果) */}
            <div className="group relative">
              {/* 卡片背后的光晕 */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-30 blur transition duration-500 group-hover:opacity-50"></div>

              {/* 卡片本体 */}
              <div className="animate-fade-in-up relative rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-2xl sm:p-10 md:p-12">
                {currentContent?.content}
              </div>
            </div>

            {/* 底部反馈 */}
            <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 text-sm text-gray-500 sm:flex-row">
              <p className="opacity-60">
                © 2026 知微 AI 平台。All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="opacity-80">这篇文档有帮助吗？</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 transition-all hover:border-green-500/30 hover:bg-white/10 hover:text-green-400">
                    <Check size={16} /> 是
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 transition-all hover:border-red-500/30 hover:bg-white/10 hover:text-red-400">
                    <X size={16} /> 否
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
