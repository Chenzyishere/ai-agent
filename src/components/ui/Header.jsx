import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, History } from 'lucide-react'; // 或者其他打开按钮
const Header = ({
  isSettingsOpen,
  isHistoryOpen,
  toggleSettings,
  toggleHistory,
}) => {
  const [isLightBg, setIsLightBg] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const navigate = useNavigate();

  // ==================== 工具函数 ====================

  /**
   * 向上遍历 DOM 树，获取实际背景色
   */
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

      // 检查是否有实际背景色（非透明）
      if (
        bgColor &&
        bgColor !== 'rgba(0, 0, 0, 0)' &&
        bgColor !== 'transparent'
      ) {
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const [r, g, b] = rgb.map(Number);
          const alpha = rgb[3] !== undefined ? Number(rgb[3]) : 1;
          if (alpha > 0) {
            return { rgb: [r, g, b], alpha };
          }
        }
      }

      // 检查是否有背景图片（渐变等）
      if (bgImage && bgImage !== 'none') {
        return { rgb: [200, 200, 200], alpha: 1, hasGradient: true };
      }

      current = current.parentElement;
    }

    // 默认白色
    return { rgb: [255, 255, 255], alpha: 1 };
  };

  /**
   * 计算颜色亮度（WCAG 感知亮度公式）
   */
  const getBrightness = (rgb) => {
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  };

  /**
   * 滚动处理函数
   */
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const lastScrollY = lastScrollYRef.current;
    // 1. 检测背景颜色
    const sampleY = currentScrollY + 150;
    const element = document.elementFromPoint(window.innerWidth / 2, sampleY);

    if (element) {
      const { rgb } = getActualBgColor(element);
      const brightness = getBrightness(rgb);
      setIsLightBg(brightness > 100);
    }

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // 向下滚动且超过 80px → 隐藏
      setIsVisible(false);
      console.log('是否显示header' + isVisible);
    } else {
      // 向上滚动 → 显示
      setIsVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  };

  // ==================== 副作用 ====================

  useEffect(() => {
    // 初始化检查
    handleScroll();

    // 添加滚动监听（节流优化）
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

    // 清理
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledScroll);
    };
  }, []);

  // ==================== 动态样式 ====================

  const headerBgClass = isLightBg
    ? 'bg-white/30 border-white/30'
    : 'bg-white/10 border-white/20';

  const textColorClass = isLightBg
    ? 'text-gray-900 drop-shadow-none'
    : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]';

  const navColorClass = isLightBg
    ? 'text-gray-700 hover:text-gray-900'
    : 'text-white/80 hover:text-white';

  const buttonClass = isLightBg
    ? 'bg-gray-900/10 border border-gray-900/30 text-gray-900 hover:bg-gray-900/20'
    : 'bg-white/10 border border-white/30 text-white hover:bg-white/20';

  const underlineColorClass = isLightBg ? 'bg-gray-900' : 'bg-white';

  const HeaderisVisible = isVisible ? '' : '-translate-y-full';

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${HeaderisVisible}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div
          className={`relative flex items-center justify-between overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300 ${headerBgClass}`}
        >
          {/* 光泽高光 */}
          <div
            className={`absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${isLightBg ? 'via-gray-400/50' : 'via-white/50'}`}
          ></div>

          {/* 内容层 */}
          <div className="relative flex w-full items-center justify-between px-5 py-1">
            {/* Logo */}

            <h1
              className={`cursor-pointer text-xl font-bold tracking-wider uppercase transition-colors duration-300 ${textColorClass}`}
            >
              <Link to="/HomePage">AI-AGENT PRO</Link>
            </h1>

            {/* 导航 */}
            <nav className="flex items-center gap-10">
              <Link
                to="#"
                className={`group relative transition-all duration-300 ${navColorClass}`}
              >
                Profile
                <span
                  className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColorClass}`}
                ></span>
              </Link>
              <Link
                to="#"
                className={`group relative transition-all duration-300 ${navColorClass}`}
              >
                Blog
                <span
                  className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColorClass}`}
                ></span>
              </Link>
              <Link
                to="#"
                className={`group relative transition-all duration-300 ${navColorClass}`}
              >
                Learn More
                <span
                  className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColorClass}`}
                ></span>
              </Link>
            </nav>

            <div className="flex justify-between">
              {/* 登录/注册按钮 */}
              <button
                onClick={toggleHistory}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isHistoryOpen
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                登录
              </button>
              {/* 历史记录按钮 */}
              <button
                onClick={toggleHistory}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isHistoryOpen
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <History
                  className={`h-5 w-5 ${isSettingsOpen ? 'animate-spin-slow' : ''}`}
                />
                历史记录
              </button>
              {/* 设置按钮 */}
              <button
                onClick={toggleSettings}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isSettingsOpen
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings
                  className={`h-5 w-5 ${isSettingsOpen ? 'animate-spin-slow' : ''}`}
                />
                设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
