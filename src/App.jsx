import React, { useEffect,useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { Spin } from 'antd'; 
import { useAuthStore } from '@/stores/useAuthStore';
import ProtectedRoute from '@/components/ui/ProtectRoute';
import HomePage from '@/pages/Homepage';
import ChatPage from '@/pages/ChatPage';
import LoginPage from '@/pages/LoginPage';
import DocPage from '@/pages/DocPage';
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
      >
        跳到主要内容
      </a>
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
    </BrowserRouter>
  );
}
