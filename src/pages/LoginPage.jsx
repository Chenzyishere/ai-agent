import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Header from '@/components/layout/Header';
import {
  Form,
  Input,
  Button,
  Card,
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

  // 如果已经登录，自动跳转回首页或之前尝试访问的页面
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
      // navigate 会在 useEffect 中触发
    } else {
      message.error(result.message);
    }
  };

  const handleRegister = async (values) => {
    clearError();
    const result = await register(values);
    if (result.success) {
      message.success('注册成功！已自动登录');
      // 注册成功后保持当前状态，useEffect 会跳转
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className="relative w-full min-h-screen md:h-lvh overflow-hidden bg-black">
      <div className="absolute inset-0 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-purple-900 via-slate-900 to-black bg-[length:200%_200%] z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[100px]" />
        <div/>
        {/* 内容容器：相对定位，确保在背景之上 */}
      <div className="relative z-10 flex flex-col min-h-screen md:h-lvh">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
<div className="w-full max-w-[480px] rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <Title level={2} className="mb-2!">
              知微AI对话平台
            </Title>
            <Text type="secondary">请输入账号以开始对话</Text>
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={clearError}
            />
          )}

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
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
                  >
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="用户名 (admin)"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: '请输入密码' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码 (123456)"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        size="large"
                        className="h-12 text-base font-medium"
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
                    size="large"
                    autoComplete="off"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: '请输入用户名' },
                        { min: 3, message: '用户名至少 3 个字符' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="设置用户名"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 8, message: '密码至少 8 个字符' },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="设置密码"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        size="large"
                        className="h-12 bg-green-600 text-base font-medium hover:bg-green-700"
                      >
                        注 册
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />

          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <div className="inline-block rounded bg-blue-50 p-3 text-xs text-blue-700">
              💡 <strong>测试账号：</strong>
              <br />
              管理员：<code>admin</code> / <code>123456789</code>
              <br />
              普通用户：<code>user</code> / <code>123456789</code>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
