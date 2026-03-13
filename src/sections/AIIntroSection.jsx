import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react'; 
// 如果没有 lucide-react，请使用下方提供的内联 SVG 替代方案

// --- 图标替代方案 (如果未安装 lucide-react) ---
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const IconArrow = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function AIIntroSection() {
  return (
    <section className="py-20 md:py-32 overflow-hidden bg-slate-950 relative">
      {/* 背景装饰：微弱的光晕 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- 左侧：图片区域 --- */}
          <div className="w-full lg:w-1/2 relative group">
            {/* 外部光晕边框 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            
            {/* 图片容器 */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 aspect-[4/3] lg:aspect-square">
              {/* 这里使用占位图，你可以替换成真实的 AI 生成图或产品截图 */}
              <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Neural Network Visualization" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* 浮动卡片装饰 (模拟 UI 界面) */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg animate-[float_4s_ease-in-out_infinite]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <IconSparkles />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">System Status</p>
                    <p className="text-sm font-bold text-white">AI Agent Active</p>
                  </div>
                  <div className="ml-auto text-green-400 text-xs font-mono flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- 右侧：文本内容区域 --- */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next Gen Technology
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              让智能触手可及 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                重塑未来的工作方式
              </span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
              我们的 AI 平台不仅仅是聊天机器人。它集成了自主代理、多模态感知与实时决策能力，
              帮助开发者与企业将创意瞬间转化为现实生产力。
            </p>

            {/* 特性列表 */}
            <ul className="space-y-4 mb-10">
              {[
                "自主任务规划与执行 (Autonomous Agents)",
                "多模态数据实时处理 (Vision & Audio)",
                "企业级安全与隐私保护 (Enterprise Security)"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="mt-1 shrink-0">
                    <IconCheck />
                  </div>
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/chat" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.7)] hover:-translate-y-1"
              >
                立即体验
                <span className="ml-2"><IconArrow /></span>
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white hover:border-white/20">
                查看文档
              </button>
            </div>
            
            {/* 底部信任标识 (可选) */}
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-6 text-gray-500 text-sm">
              <span>Trusted by innovators at</span>
              <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                 {/* 简单的公司 Logo 占位符 */}
                 <div className="h-6 w-20 bg-white/20 rounded"></div>
                 <div className="h-6 w-20 bg-white/20 rounded"></div>
                 <div className="h-6 w-20 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}