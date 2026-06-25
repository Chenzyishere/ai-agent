import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Settings, History, X, Menu, Moon, Sun, Home, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Avatar, Dropdown, message } from 'antd';
import { ConfirmDialog } from '@/components/ui/DialogEdit';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
const Header = ({
  isSettingsOpen = false,
  isHistoryOpen = false,
  toggleSettings,
  toggleHistory,
  collapsible = false,
}) => {
  const { user, logout } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme } = useThemeStore();
  const [isLightBg, setIsLightBg] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ==================== 工具函数 ====================

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const doLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    message.success('已安全退出');
    navigate('/login');
  };

  const getActualBgColor = (element) => {
    let current = element;
    while (
      current &&
      current !== document.body &&
      current !== document.documentElement
    ) {
      const style = window.getComputedStyle(current);
      const bgColor = style.backgroundColor;
      const bgImage = style.backgroundImage;

      if (
        bgColor &&
        bgColor !== 'rgba(0, 0, 0, 0)' &&
        bgColor !== 'transparent'
      ) {
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const [r, g, b] = rgb.map(Number);
          const alpha = rgb[3] !== undefined ? Number(rgb[3]) : 1;
          if (alpha > 0) return { rgb: [r, g, b], alpha };
        }
      }

      if (bgImage && bgImage !== 'none') {
        return { rgb: [200, 200, 200], alpha: 1, hasGradient: true };
      }
      current = current.parentElement;
    }
    return { rgb: [255, 255, 255], alpha: 1 };
  };

  const getBrightness = (rgb) => {
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const lastScrollY = lastScrollYRef.current;

    // 1. 检测背景颜色
    if (!isMobileMenuOpen) {
      const sampleY = currentScrollY + 10;
      if (sampleY < document.documentElement.scrollHeight) {
        const element = document.elementFromPoint(
          window.innerWidth / 2,
          sampleY,
        );
        if (element) {
          const { rgb } = getActualBgColor(element);
          const brightness = getBrightness(rgb);
          setIsLightBg(brightness > 100);
        }
      }
    }

    // 2. 控制 Header 显示/隐藏
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  };

  useEffect(() => {
    handleScroll();

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledScroll);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // 导航数据配置
  const navItems = [
    { label: 'Blog', to: 'https://blog.chenzymark.space' },
    { label: 'Doc', to: '/doc' },
  ];

  const dropdownItems = [
    {
      key: 'username',
      label: user?.displayName || user?.username || '访客',
      icon: <UserOutlined />,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // ==================== 动态样式 ====================

  // 注意：深色模式下稍微加深背景，保证文字可读性
  const headerBgClass = isLightBg
    ? 'bg-white/30 border-white/30'
    : 'bg-black/60 border-white/10';

  const textColorClass = isLightBg
    ? 'text-gray-900 drop-shadow-none'
    : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]';

  const navColorClass = isLightBg
    ? 'text-gray-700 hover:text-gray-900'
    : 'text-white/80 hover:text-white';

  const underlineColorClass = isLightBg ? 'bg-gray-900' : 'bg-white';

  const headerShown = collapsible ? (!isCollapsed && isVisible) : isVisible;
  const HeaderisVisible = headerShown ? 'translate-y-0' : '-translate-y-full';

  return (
    <>
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${HeaderisVisible}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div
          className={`relative flex items-center justify-between overflow-visible rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 ${headerBgClass}`}
        >
          {/* 光泽高光 */}
          <div
            className={`absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${
              isLightBg ? 'via-gray-400/50' : 'via-white/50'
            }`}
          ></div>

          {/* 内容层 */}
          <div className="relative flex w-full items-center justify-between px-4 py-1 sm:px-5">
            {/* Logo */}
            <h1
              className={`w-1/3 cursor-pointer text-xl font-bold tracking-wider uppercase transition-colors duration-300 ${textColorClass}`}
              onClick={closeMobileMenu}
            >
              <Link to="/">知微AI对话平台</Link>
            </h1>

            {/* --- 桌面端导航 (md 及以上显示) --- */}
            <nav className="hidden w-1/3 items-center gap-8 md:flex md:justify-center lg:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`group relative transition-all duration-300 ${navColorClass}`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColorClass}`}
                  ></span>
                </Link>
              ))}
            </nav>

            {/* --- 右侧操作区 --- */}
            <div className="flex w-1/3 items-center justify-end gap-2 sm:gap-3">
              {/* 桌面端按钮组 (md 及以上显示) */}
              <div className="hidden items-center gap-2 md:flex">
                {isAuthenticated && (
                  <Dropdown
                    menu={{ items: dropdownItems }}
                    placement="bottomRight"
                    trigger={['hover']}
                    arrow
                  >
                    <button
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Avatar
                        src={user?.avatar}
                        icon={!user?.avatar && <UserOutlined />}
                        size="small"
                        className="bg-blue-500"
                      />
                    </button>
                  </Dropdown>
                )}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isHistoryOpen
                        ? 'bg-white/20 text-white shadow-inner'
                        : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                    }`}
                  >
                    登录
                  </Link>
                )}
                {!isHomePage && (
                  <Link
                    to="/"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-label="主页"
                  >
                    <Home size={20} />
                  </Link>
                )}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label="Toggle Theme"
                  id="tour-theme-btn"
                >
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {toggleHistory && (
                <button
                  onClick={toggleHistory}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isHistoryOpen
                      ? 'bg-white/20 text-white shadow-inner'
                      : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                  }`}
                  aria-label="History"
                  id="tour-history-btn"
                >
                  <History
                    className={`h-5 w-5 ${isHistoryOpen ? 'animate-spin-slow' : ''}`}
                  />
                </button>
                )}

                {toggleSettings && (
                <button
                  onClick={toggleSettings}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isSettingsOpen
                      ? 'bg-white/20 text-white shadow-inner'
                      : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                  }`}
                  aria-label="Settings"
                  id="tour-settings-btn"
                >
                  <Settings
                    className={`h-5 w-5 ${isSettingsOpen ? 'animate-spin-slow' : ''}`}
                  />
                </button>
                )}
                {collapsible && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-label={isCollapsed ? '展开顶栏' : '收起顶栏'}
                    title={isCollapsed ? '展开顶栏' : '收起顶栏'}
                  >
                    <ChevronUp className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* 移动端菜单按钮 (仅 md 以下显示) */}
              <button
                className="rounded-lg p-2 transition-colors duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className={`h-6 w-6 ${textColorClass}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${textColorClass}`} />
                )}
              </button>
            </div>
          </div>

          {/* --- 移动端下拉菜单 (原生 CSS 动画实现) --- */}
          {/* 
             关键点：
             1. 使用 max-height 和 opacity 进行过渡，不依赖外部插件。
             2. overflow-hidden 确保内容不溢出。
             3. z-[9999] 确保层级最高。
          */}
          <div
            className={`absolute top-full right-0 left-0 z-50 mx-2 mt-2 origin-top overflow-hidden rounded-2xl border border-white/10 bg-[#1a1030]/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-in-out sm:mx-4 md:hidden ${
              isMobileMenuOpen
                ? 'visible max-h-96 scale-100 opacity-100'
                : 'invisible max-h-0 scale-95 opacity-0'
            }`}
          >
            <div className="flex flex-col space-y-1 p-4">
              {/* 返回主页 (移动端) */}
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                  <Home className="h-5 w-5" />
                  返回主页
                </Link>
              )}

              {/* 导航链接 */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-white/10"></div>

              {/* 功能按钮 */}
              {toggleHistory && (
              <button
                onClick={() => {
                  toggleHistory();
                  closeMobileMenu();
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isHistoryOpen
                    ? 'bg-purple-500/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <History className="h-5 w-5" />
                历史记录
              </button>
              )}

              {toggleSettings && (
              <button
                onClick={() => {
                  toggleSettings();
                  closeMobileMenu();
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isSettingsOpen
                    ? 'bg-purple-500/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                设置
              </button>
              )}

              {isLoginPage ? (
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-200 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25"
                >
                  返回主页
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-200 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25"
                >
                  登录 / 注册
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* 收起时的小按钮 */}
    {collapsible && isCollapsed && (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-3 left-1/2 z-50 -translate-x-1/2 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-black/40 backdrop-blur-xl text-white/70 border border-white/10 shadow-lg transition-all hover:text-white hover:bg-black/60 hover:border-white/20"
        aria-label="展开顶栏"
      >
        <ChevronDown className="h-4 w-4" />
        <span>展开顶栏</span>
      </button>
    )}

    <ConfirmDialog
      visible={showLogoutConfirm}
      title="退出登录"
      onCancel={() => setShowLogoutConfirm(false)}
      onConfirm={doLogout}
    >
      确定要退出登录吗？
    </ConfirmDialog>
  </>
);
};

export default Header;
