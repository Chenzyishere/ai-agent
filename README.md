# 🚀 Modern LLM Chat Interface

一个基于 React 19 + Vite + Tailwind CSS + Zustand 构建的高性能、流式响应的大语言模型（LLM）聊天界面。本项目专注于提供极致的用户交互体验，实现了完美的流式打字机效果、多会话管理以及健壮的状态处理机制。

项目现已上线：(通过Github Page部署)

链接：https://ai-agent.chenzymark.space

## ✨ 核心特性

⚡️ 极速流式响应：基于 Fetch Stream API 实现真实的打字机效果，支持实时渲染 AI 生成的每一个字符。

🧠 智能状态管理：使用 Zustand 进行全局状态管理，配合 persist 中间件实现对话历史的本地持久化。

🎨 现代化 UI：基于 Tailwind CSS 的原子化样式，完全响应式设计，支持移动端与桌面端完美适配。

🔄 多会话支持：支持创建、切换、管理多个独立的对话上下文。

📝 思维链展示：支持解析并展示 AI 的 reasoning_content (思考过程) 与最终回复。

⌨️ 用户体验优化：
发送时自动禁用输入框防止重复提交。
自动滚动到底部。
优雅的加载状态与错误处理。

## 🛠️ 技术栈
类别 技术选型 说明
核心框架 React 19+ 利用最新并发特性提升渲染性能

构建工具 Vite 6+ 毫秒级热更新 (HMR) 与极速构建

样式方案 Tailwind CSS 4+ 实用优先 (Utility-first) 的原子化 CSS

状态管理 Zustand 轻量级、无样板代码的全局状态库

HTTP 请求 Fetch API 原生支持 Stream 读取，无需额外依赖

图标库 Lucide React 简洁美观的 SVG 图标集

组件库 Antd 简洁快速的组件库

代码规范 ESLint + Prettier 统一的代码风格与质量保障

## 📂 项目结构

src/
├── assets/ # 静态资源 (图片、字体等)
├── components/ # 组件库
│ ├── layout/ # 布局组件 (全局框架)
│ │ ├── ChatContainer.jsx # 聊天主容器 (含自动滚动逻辑)
│ │ ├── ChatInput.jsx # 底部输入框 (带防抖与状态控制)
│ │ ├── Footer.jsx # 页脚
│ │ ├── Header.jsx # 顶部导航栏
│ │ ├── HistoryChat.jsx # 历史会话侧边栏
│ │ └── SettingsPanel.jsx # 设置面板
│ ├── ui/ # 基础 UI 原子组件 (高复用)
│ │ ├── DialogEdit.jsx # 编辑对话框
│ │ ├── GradientButton.jsx # 渐变按钮
│ │ ├── MessageItem.jsx # 消息气泡渲染 (支持 Markdown)
│ │ └── ProtectRoute.jsx # 路由守卫组件
│ ├── pages/ # 页面级组件 (路由入口)
│ │ ├── ChatPage.jsx # 聊天主页面
│ │ ├── DocPage.jsx # 文档页
│ │ ├── HomePage.jsx # 首页
│ │ └── LoginPage.jsx # 登录页
│ ├── sections/ # 页面区块组件 (组合型)
│ │ ├── AIFeatures.jsx # AI 特性展示区
│ │ ├── AIIntroSection.jsx # AI 介绍区
│ │ ├── AITimeline.jsx # 时间轴组件
│ │ ├── Banner.jsx # 横幅广告/宣传区
│ │ └── Carousel.jsx # 轮播图
│ └── stores/ # 状态管理 (Zustand Stores)
│ ├── useAuthStore.js # 认证状态
│ ├── useChatStore.js # 聊天核心状态 (消息/流式)
│ ├── useSettingsStore.js # 用户设置状态
│ └── useThemeStore.js # 主题切换状态
├── config/ # 配置文件
│ └── theme.js # 全局主题配置
├── hooks/ # 自定义 Hooks
├── services/ # API 服务层
│ ├── api.js # 核心 API 请求封装 (Stream 处理)
│ └── interceptor.js # 请求拦截器 (Token 注入/错误处理)
├── styles/ # 全局样式
│ └── index.css # Tailwind 指令与全局 CSS
├── utils/ # 工具函数
│ ├── markdown.js # Markdown 解析工具
│ └── messageHandler.js # 消息格式化与处理逻辑
├── App.jsx # 应用根组件 (路由定义)
└── main.jsx # 入口文件

## 🚀 快速开始

### 前置要求

Node.js >= 20.x
npm >= 10.x

安装与运行

克隆项目
git clone
cd

安装依赖
npm install

启动开发服务器
npm run dev

    访问 http://localhost:5173 即可预览。

生产构建
npm run build
npm run preview

## 🏗️ 核心架构设计(仍在更新)

### 状态管理策略 (Zustand)
本项目摒弃了单一的巨型 Store 模式，采用领域驱动设计 (Domain-Driven Design) 思想，将全局状态拆分为四个独立的 Store。这种策略有效降低了模块间的耦合度，避免了无关组件的重渲染，提升了应用性能。

1. useAuthStore (认证域)
   职责：管理用户身份验证与会话安全。
   核心数据：
   user: 当前登录用户信息。
   token: JWT 访问令牌。
   isAuthenticated: 登录状态布尔值。
   isLoading: 登录/登出加载状态。
   关键操作：login, logout, refreshToken, checkAuth。
   持久化：敏感信息（如 Token）加密存储于 localStorage。

2. useChatStore (聊天核心域)
   职责：处理所有与对话相关的复杂逻辑，是应用最核心的状态中心。
   核心数据：
   conversations: 会话列表（包含 ID、标题、更新时间）。
   currentConversationId: 当前激活的会话 ID。
   messages: 当前会话的消息队列（支持流式更新）。
   关键操作：
   createConversation: 新建会话。
   sendMessage: 发送用户消息并触发流式接收。
   updateLastMessage: 原子化更新最后一条 AI 消息的内容（流式打字机效果）。
   finishStreamResponse: 标记流结束，锁定消息状态 (isComplete: true)。
   deleteConversation: 删除会话。

3. useSettingsStore (配置域)
   职责：管理用户的功能偏好与系统行为配置。
   核心数据：
   apiKey: 用户自定义的 API Key（可选，若不由后端托管）。
   model: 当前选用的 LLM 模型 (e.g., gpt-4, claude-3).
   temperature: 模型创造性参数。
   systemPrompt: 自定义系统提示词。
   autoScroll: 是否开启自动滚动。
   关键操作：updateSetting, resetToDefault。
   持久化：所有配置项自动同步至 localStorage。
4. useThemeStore (界面域)
   职责：控制应用的视觉表现与主题切换。
   核心数据：
   theme: 当前主题模式 (light, dark, system)。
   sidebarOpen: 侧边栏展开/收起状态。
   fontSize: 聊天字体大小偏好。
   关键操作：toggleTheme, setSidebarState。
   副作用：监听主题变化，动态修改 <html> 标签的 class 以适配 Tailwind CSS 的深色模式。

### 流式更新机制：

流式响应处理 (Streaming Logic)

在 services/api.js 中使用 ReadableStreamDefaultReader 逐块读取数据：

const reader = response.body.getReader();
while (true) {
const { done, value } = await reader.read();
if (done) break;
// 解码 chunk -> 解析 JSON -> 提取 content
// 调用 store.updateLastMessage(...)
}

## ⚙️ 配置与定制

修改 API 提供商
编辑 src/services/api.js，调整 fetch 请求的 URL 和 Payload 格式以适配不同的 LLM 后端（如 OpenAI, Azure, LocalLLM 等）。

主题与样式
项目使用 Tailwind CSS。如需自定义颜色或字体，修改 src/index.css (v4)。

## 🐛 常见问题 (FAQ)

Q: 为什么消息发送后没有反应？
A: 请检查浏览器控制台 (F12) 是否有 CORS 错误或 API Key 无效报错。

Q: 刷新页面后对话消失了？
A: 对话数据存储在 localStorage 中。如果消失，可能是浏览器隐私模式限制了存储，或者手动清除了缓存。

Q: 遇到 "Loading 状态卡死" 或 "无法再次对话"？
A: 这通常是旧版本的状态残留。请尝试在 Application -> Local Storage 中删除 llm-chat-store 键值，然后刷新页面。新版代码已包含防御逻辑，此问题不应再复现。
