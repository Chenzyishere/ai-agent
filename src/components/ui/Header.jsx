import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, History, Menu, X } from 'lucide-react';

const Header = ({
  isSettingsOpen,
  isHistoryOpen,
  toggleSettings,
  toggleHistory,
}) => {
  const [isLightBg, setIsLightBg] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();

  // 导航数据配置
  const navItems = [
    { label: 'Profile', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Learn More', to: '#' },
  ];

  // ==================== 工具函数 ====================

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
      const sampleY = currentScrollY + 150;
      if (sampleY < document.documentElement.scrollHeight) {
        const element = document.elementFromPoint(window.innerWidth / 2, sampleY);
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

  const HeaderisVisible = isVisible ? 'translate-y-0' : '-translate-y-full';

  return (
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
          <div className="relative flex w-full items-center justify-between px-4 sm:px-5 py-1">
            
            {/* Logo */}
            <h1
              className={`cursor-pointer text-xl font-bold tracking-wider uppercase transition-colors duration-300 ${textColorClass}`}
              onClick={closeMobileMenu}
            >
              <Link to="/HomePage">AI-AGENT PRO</Link>
            </h1>

            {/* --- 桌面端导航 (md 及以上显示) --- */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
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
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* 桌面端按钮组 (md 及以上显示) */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={toggleHistory}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isHistoryOpen
                      ? 'bg-white/20 text-white shadow-inner'
                      : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                  }`}
                >
                  登录
                </button>
                
                <button
                  onClick={toggleHistory}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isHistoryOpen
                      ? 'bg-white/20 text-white shadow-inner'
                      : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                  }`}
                  aria-label="History"
                >
                  <History className={`h-5 w-5 ${isHistoryOpen ? 'animate-spin-slow' : ''}`} />
                  <span className="hidden lg:inline">历史记录</span>
                </button>

                <button
                  onClick={toggleSettings}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isSettingsOpen
                      ? 'bg-white/20 text-white shadow-inner'
                      : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                  }`}
                  aria-label="Settings"
                >
                  <Settings className={`h-5 w-5 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} />
                  <span className="hidden lg:inline">设置</span>
                </button>
              </div>

              {/* 移动端菜单按钮 (仅 md 以下显示) */}
              <button
                className="md:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
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
            className={`
              md:hidden absolute top-full left-0 right-0 mx-2 sm:mx-4 mt-2 rounded-2xl overflow-hidden shadow-2xl border backdrop-blur-xl z-50
              transition-all duration-300 ease-in-out origin-top
              ${isMobileMenuOpen 
                ? 'opacity-100 scale-100 max-h-96 visible' 
                : 'opacity-0 scale-95 max-h-0 invisible'}
              bg-amber-50 border-none
            `}
          >
            <div className="flex flex-col p-4 space-y-1">
              {/* 导航链接 */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                    isLightBg 
                      ? 'text-gray-800 hover:bg-gray-900/5' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className={`h-px my-2 ${isLightBg ? 'bg-gray-900/10' : 'bg-white/10'}`}></div>

              {/* 功能按钮 */}
              <button
                onClick={() => { toggleHistory(); closeMobileMenu(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isHistoryOpen
                    ? 'bg-white/20 text-white shadow-inner'
                    : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/5' : 'text-white/80 hover:bg-white/10'}`
                }`}
              >
                <History className="h-5 w-5" />
                历史记录
              </button>

              <button
                onClick={() => { toggleSettings(); closeMobileMenu(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isSettingsOpen
                    ? 'bg-white/20 text-white shadow-inner'
                    : `${isLightBg ? 'text-gray-700 hover:bg-gray-900/5' : 'text-white/80 hover:bg-white/10'}`
                }`}
              >
                <Settings className="h-5 w-5" />
                设置
              </button>

              <button
                onClick={() => { closeMobileMenu(); }}
                className={`mt-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isLightBg
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                登录 / 注册
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;