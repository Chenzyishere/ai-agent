import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, Navigate, BrowserRouter, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/stores/useAuthStore';
import ProtectedRoute from '@/components/ui/ProtectRoute';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AppTour from '@/components/ui/AppTour';
import HomePage from '@/pages/Homepage';

const ChatPage = lazy(() => import('@/pages/ChatPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DocPage = lazy(() => import('@/pages/DocPage'));

const TOUR_KEY = 'zhiwei-tour-completed';

const homeSteps = [
  {
    selector: '#tour-model',
    title: '3D 交互模型',
    description: '将鼠标移动到模型上，试试拖动视角。模型会跟随鼠标转动，支持 3D 旋转交互。',
    placement: 'left',
  },
  {
    selector: '#tour-start-btn',
    title: '开始对话',
    description: '点击"马上开始"按钮，进入 AI 对话页面，体验智能对话功能。',
    placement: 'bottom',
  },
];

const chatSteps = [
  {
    selector: '#tour-chat-input',
    title: '发送消息',
    description: '在这里输入问题或需求。Enter 发送，Shift+Enter 换行。支持上传图片和文件。',
    placement: 'top',
  },
  {
    selector: '#tour-settings-btn',
    title: '对话设置',
    description: '点击打开设置面板。可切换 API 厂商、选择模型、调整 Temperature 等参数。',
    placement: 'bottom',
  },
  {
    selector: '#tour-history-btn',
    title: '历史对话',
    description: '查看和管理历史对话记录。可以切换、编辑名称或删除对话。',
    placement: 'bottom',
  },
  {
    selector: '#tour-theme-btn',
    title: '主题切换',
    description: '切换深色/浅色模式。在设置面板中还可以选择不同的背景主题。',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="message-actions"]',
    title: '消息操作',
    description: '每条回复都支持复制内容、点赞/点踩反馈。最后一条消息还可以刷新重新生成。',
    placement: 'top',
  },
];

function TourManager() {
  const location = useLocation();
  const [tourCompleted, setTourCompleted] = useState(() => {
    try { return localStorage.getItem(TOUR_KEY) === 'true'; } catch { return false; }
  });

  const [phase, setPhase] = useState(() => {
    try {
      if (localStorage.getItem(TOUR_KEY) === 'true') return 'done';
      return localStorage.getItem('zhiwei-tour-phase') || 'home';
    } catch { return 'home'; }
  });

  const isHome = location.pathname === '/';
  const isChat = location.pathname === '/chat';

  if (tourCompleted || phase === 'done') return null;

  if (isHome && phase === 'home') {
    return (
      <AppTour
        key="home-tour"
        steps={homeSteps}
        onFinish={() => {
          setPhase('chat');
          try { localStorage.setItem('zhiwei-tour-phase', 'chat'); } catch {}
        }}
      />
    );
  }

  if (isChat && phase === 'chat') {
    return (
      <AppTour
        key="chat-tour"
        steps={chatSteps}
        delay={1200}
        onFinish={() => {
          setTourCompleted(true);
          try { localStorage.setItem(TOUR_KEY, 'true'); } catch {}
        }}
      />
    );
  }

  return null;
}

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
    <Spin size="large" description="加载中..." />
  </div>
);

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    // 应用启动时，检查本地是否有有效Token
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initAuth();
  },[checkAuth]);

  // 加载期间显示全屏Loading
  // 加载期间显示全屏 Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
        <Spin size="large" description="正在验证身份..." />
        <p className="mt-4 text-gray-500 text-sm">请勿关闭页面</p>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <TourManager />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
      >
        跳到主要内容
      </a>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/doc" element={<DocPage />} />
            {/* 受保护的路由 */}
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            {/* 4.404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
