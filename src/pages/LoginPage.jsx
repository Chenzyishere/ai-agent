import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Header from '@/components/layout/Header';
import ThemeBackground from '@/components/ui/ThemeBackground';
import {
  Form,
  Input,
  Button,
  Tabs,
  message,
  Typography,
  Alert,
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    document.title =
      activeTab === 'register'
        ? '注册 - 知微AI对话平台'
        : '登录 - 知微AI对话平台';
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (values) => {
    clearError();
    const result = await login(values);
    if (result.success) {
      message.success('登录成功！欢迎回来');
    } else {
      message.error(result.message);
    }
  };

  const handleRegister = async (values) => {
    clearError();
    const result = await register(values);
    if (result.success) {
      message.success('注册成功！已自动登录');
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black">
      <ThemeBackground />

      <div className="relative z-10 flex flex-col h-dvh">
        <Header />
        <main className="flex-1 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-20 sm:pt-28 overflow-y-auto">
          <div className="w-full max-w-[440px]">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="flex flex-col items-center px-6 pt-5 pb-2 sm:pt-8 sm:pb-4">
                <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-white text-xl sm:text-2xl font-bold shadow-lg shadow-purple-500/25">
                  AI
                </div>
                <Title
                  level={2}
                  className="mb-1! text-white! text-2xl! tracking-wide!"
                >
                  知微AI对话平台
                </Title>
                <Text className="text-white/50! text-sm!">
                  {activeTab === 'register' ? '创建账号以开始探索' : '欢迎回来，请登录您的账号'}
                </Text>
              </div>

              <div className="px-5 sm:px-6">
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={clearError}
                    className="mb-2"
                  />
                )}
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-8">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="middle"
                  tabBarGutter={0}
                  centered
                  className="[&_.ant-tabs-nav]:px-0! [&_.ant-tabs-nav]:mx-0! [&_.ant-tabs-nav-wrap]:px-0! [&_.ant-tabs-nav::before]:border-white/10! [&_.ant-tabs-nav]:mb-4! sm:[&_.ant-tabs-nav]:mb-6! [&_.ant-tabs-tab]:m-0! [&_.ant-tabs-tab]:flex-1! [&_.ant-tabs-tab]:justify-center! [&_.ant-tabs-tab]:px-3! sm:[&_.ant-tabs-tab]:px-4! [&_.ant-tabs-tab]:py-2! [&_.ant-tabs-tab]:text-sm! [&_.ant-tabs-tab]:text-white/50! [&_.ant-tabs-tab]:transition-colors! [&_.ant-tabs-tab-active]:text-white! [&_.ant-tabs-ink-bar]:bg-purple-400! [&_.ant-tabs-tab+.ant-tabs-tab]:ml-0!"
                  tabBarStyle={{ display: 'flex' }}
                  items={[
                    {
                      key: 'login',
                      label: '账号登录',
                      children: (
                        <Form
                          name="login_form"
                          onFinish={handleLogin}
                          layout="vertical"
                          size="large"
                          autoComplete="off"
                          requiredMark={false}
                          className="[&_.ant-form-item]:mb-3! sm:[&_.ant-form-item]:mb-4!"
                        >
                          <Form.Item
                            label={<span className="text-white/70 text-xs sm:text-sm">用户名</span>}
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                          >
                            <Input
                              prefix={<UserOutlined />}
                              placeholder="admin"
                              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '10px', height: '40px' }}
                              styles={{ input: { color: '#1f2937' } }}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<span className="text-white/70 text-xs sm:text-sm">密码</span>}
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                          >
                            <Input.Password
                              prefix={<LockOutlined />}
                              placeholder="123456789"
                              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '10px', height: '40px' }}
                              styles={{ input: { color: '#1f2937' } }}
                            />
                          </Form.Item>
                          <Form.Item className="mb-0!">
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={isLoading}
                              block
                              size="middle"
                              className="h-10 sm:h-11 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 border-0! text-sm sm:text-base font-medium shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-blue-600"
                            >
                              登 录
                            </Button>
                          </Form.Item>
                        </Form>
                      ),
                    },
                    {
                      key: 'register',
                      label: '新用户注册',
                      children: (
                        <Form
                          name="register_form"
                          onFinish={handleRegister}
                          layout="vertical"
                          size="middle"
                          autoComplete="off"
                          requiredMark={false}
                          className="[&_.ant-form-item]:mb-3! sm:[&_.ant-form-item]:mb-4!"
                        >
                          <Form.Item
                            label={<span className="text-white/70 text-xs sm:text-sm">用户名</span>}
                            name="username"
                            rules={[
                              { required: true, message: '请输入用户名' },
                              { min: 3, message: '用户名至少 3 个字符' },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined />}
                              placeholder="设置用户名"
                              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '10px', height: '40px' }}
                              styles={{ input: { color: '#1f2937' } }}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<span className="text-white/70 text-xs sm:text-sm">邮箱</span>}
                            name="email"
                            rules={[
                              { required: true, message: '请输入邮箱' },
                              { type: 'email', message: '请输入有效的邮箱地址' },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined />}
                              placeholder="邮箱地址"
                              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '10px', height: '40px' }}
                              styles={{ input: { color: '#1f2937' } }}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<span className="text-white/70 text-xs sm:text-sm">密码</span>}
                            name="password"
                            rules={[
                              { required: true, message: '请输入密码' },
                              { min: 8, message: '密码至少 8 个字符' },
                            ]}
                          >
                            <Input.Password
                              prefix={<LockOutlined />}
                              placeholder="设置密码"
                              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '10px', height: '40px' }}
                              styles={{ input: { color: '#1f2937' } }}
                            />
                          </Form.Item>
                          <Form.Item className="mb-0!">
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={isLoading}
                              block
                              size="middle"
                              className="h-10 sm:h-11 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 border-0! text-sm sm:text-base font-medium shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600"
                            >
                              注 册
                            </Button>
                          </Form.Item>
                        </Form>
                      ),
                    },
                  ]}
                />

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                  <span className="text-xs text-white/40">测试账号</span>
                  <div className="mt-1.5 flex items-center justify-center gap-4 text-xs">
                    <span className="text-white/50">
                      <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-purple-300">admin</code>
                      <span className="text-white/30"> / </span>
                      <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-purple-300">123456789</code>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/50">
                      <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-purple-300">user</code>
                      <span className="text-white/30"> / </span>
                      <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-purple-300">123456789</code>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
