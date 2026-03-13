import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器：自动添加 Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理 401 (未授权/Token 过期)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，强制退出
      const authStore = useAuthStore.getState();
      if (authStore.isAuthenticated) {
        alert('登录已过期，请重新登录');
        authStore.logout();
        window.location.href = '/login'; // 跳转到登录页
      }
    }
    return Promise.reject(error);
  }
);

export default api;