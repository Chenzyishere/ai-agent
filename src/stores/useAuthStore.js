import { message } from 'antd';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MOCK_ADMIN = {
  username: 'admin',
  password: '123456789',
  displayName: '超级管理员',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
};

const MOCK_USER = {
  username: 'user',
  password: '123456789',
  displayName: '普通用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 1.模拟登录
      login: async ({ username, password }) => {
        set({ isLoading: true, error: null });

        // 模拟网络延迟(800ms)
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 查找匹配的用户
        let foundUser = null;
        if (
          username === MOCK_ADMIN.username &&
          password === MOCK_ADMIN.password
        ) {
          foundUser = MOCK_ADMIN;
        } else if (
          username === MOCK_USER.username &&
          password === MOCK_USER.password
        ) {
          foundUser = MOCK_USER;
        }

        if (foundUser) {
          // 生成一个假的JWT Token
          const fakeToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          set({
            user: foundUser,
            token: fakeToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } else {
          set({
            error: '用户名或密码错误（提示：admin / 123456）',
            isLoading: false,
          });
          return { success: false, message: '用户名或密码错误' };
        }
      },

      // 模拟注册
      register: async ({ username, password, email }) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 简单校验
        if (password.length < 8) {
          set({ error: '密码长度至少为8位', isLoading: false });
          return { success: false, message: '密码太短' };
        }

        if (
          username === MOCK_ADMIN.username ||
          username === MOCK_USER.username
        ) {
          set({ error: '用户名已被占用', isLoading: false });
          return { success: false, message: '用户名已存在' };
        }

        // 注册成功 ->直接创建用户并自动登录
        const newUser = {
          username,
          displayName: username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          email: email || '',
        };

        const fakeToken = `mock_jwt_reg_${Date.now()}`;

        set({
            user:newUser,
            token:fakeToken,
            isAuthenticated:true,
            isLoading:false,
        });
        return {success:true}
      },

    //退出登录
    logout:() => {
        set({user:null,token:null,isAuthenticated:false,error:null});
        // localStorage.removeItem('auth-storage');清除本地存储
    },
    // 初始化校验
    checkAuth:async() => {
        const state = get();
        // 如果没有token，直接认为未登录
        if(!state.token){
            console.log('没有token，未登录');
            set({isAuthenticated:false});
            return false;
        }

        // 模拟校验Token有效性的延迟
        await new Promise((resolve) => setTimeout(resolve,300));
        // 只要token是以mock_jwt_开头，就认为有效
        if(state.token.startsWith('mock_jwt_')){
            console.log('token以mock_jwt_开始，已登录');
            set({isAuthenticated:true});
            return true;
        }else {
            // Token无效，强制登出
            console.log('token无效，已登出');
            get().logout();
            return false;
        }
    },
    clearError:() => set({error:null}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
