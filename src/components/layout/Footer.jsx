import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, MessageCircle, ArrowUp, Rss, ExternalLink } from 'lucide-react';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      className="fixed right-6 bottom-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white/60 shadow-lg transition-all hover:text-white hover:bg-black/80 hover:scale-110"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-5">
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
          />

          <div className="relative z-10 flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-8">
            {/* 上排：品牌 + 导航 + 联系 */}
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between">
              {/* 品牌 */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">知微AI平台</h3>
                <p className="text-sm text-white/40">打造给用户提供优秀体验的AI平台</p>
              </div>

              {/* 导航链接 */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/35">导航</h4>
                <div className="flex flex-col gap-1.5 text-sm text-white/50">
                  <Link to="/" className="transition-colors hover:text-white/80">首页</Link>
                  <Link to="/doc" className="transition-colors hover:text-white/80">文档</Link>
                  <Link to="/chat" className="transition-colors hover:text-white/80">对话</Link>
                </div>
              </div>

              {/* 友情链接 */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/35">友链</h4>
                <div className="flex flex-col gap-1.5 text-sm text-white/50">
                  <a href="https://blog.chenzymark.space" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white/80">Blog</a>
                  <a href="https://github.com/ChenzyMarkkk" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white/80">GitHub</a>
                </div>
              </div>

              {/* 联系我 + 订阅 */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/35">联系 + 订阅</h4>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="https://github.com/ChenzyMarkkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                  <span className="flex items-center gap-1.5 text-sm text-white/50">
                    <MessageCircle className="h-3.5 w-3.5" />
                    微信: zhiweiai
                  </span>
                  <a
                    href="https://blog.chenzymark.space/index.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    <Rss className="h-3.5 w-3.5" />
                    RSS 订阅
                  </a>
                  <a
                    href="https://github.com/ChenzyMarkkk/ai-agent/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    更新日志
                  </a>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-white/10" />

            {/* 下排：版权 + 备案 + 技术栈 */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-white/30">
                &copy; {currentYear} 知微AI. All rights reserved.
              </p>
              <p className="text-xs text-white/20">
                ICP备2025xxxxxxxx号-1 &nbsp;|&nbsp; Powered by React + Vite + Ant Design
              </p>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
