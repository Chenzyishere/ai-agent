import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Cpu, 
  Lock 
} from 'lucide-react';

export default function AIIntroSection() {
  return (
    // 根容器：
    // 浅色：bg-gray-50 (柔和灰白)
    // 深色：bg-slate-950 (深邃黑)
    <section className="py-20 md:py-32 overflow-hidden bg-gray-50 dark:bg-slate-950 relative transition-colors duration-500">
      
      {/* --- 背景装饰 (仅在深色模式下显示光晕，浅色模式保持干净) --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none hidden dark:block"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none hidden dark:block"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- 左侧：图片区域 --- */}
          <div className="w-full lg:w-1/2 relative group">
            {/* 外部光晕边框：浅色模式下减弱，深色模式下增强 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 dark:opacity-40 group-hover:opacity-50 transition duration-500"></div>
            
            {/* 图片容器 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 aspect-[4/3] lg:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Neural Network Visualization" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* 浮动卡片装饰 */}
              {/* 浅色：bg-white/90，深色：bg-slate-900/80 */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-lg animate-[float_4s_ease-in-out_infinite]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">System Status</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">AI Agent Active</p>
                  </div>
                  <div className="ml-auto text-green-600 dark:text-green-400 text-xs font-mono flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- 右侧：文本内容区域 --- */}
          <div className="w-full lg:w-1/2 text-left">
            
            {/* Badge: 浅色蓝底深蓝字，深色蓝底浅蓝字 */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
              </span>
              Next Gen Technology
            </div>

            {/* 标题：浅色深灰，深色白 + 渐变 */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              让智能触手可及 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                重塑未来的工作方式
              </span>
            </h2>

            {/* 描述文本：浅色灰字，深色灰白字 */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
              我们的 AI 平台不仅仅是聊天机器人。它集成了自主代理、多模态感知与实时决策能力，
              帮助开发者与企业将创意瞬间转化为现实生产力。
            </p>

            {/* 特性列表 */}
            <ul className="space-y-4 mb-10">
              {[
                { icon: <Bot size={20} />, text: "自主任务规划与执行 (Autonomous Agents)" },
                { icon: <Cpu size={20} />, text: "多模态数据实时处理 (Vision & Audio)" },
                { icon: <ShieldCheck size={20} />, text: "企业级安全与隐私保护 (Enterprise Security)" }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <div className="mt-1 shrink-0 text-purple-600 dark:text-purple-400">
                    {item.icon}
                  </div>
                  <span className="text-base font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/chat" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
              >
                立即体验
                <ArrowRight size={20} className="ml-2" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20">
                查看文档
              </button>
            </div>
            
            {/* 底部信任标识 */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/5 flex items-center gap-6 text-gray-500 dark:text-gray-500 text-sm">
              <span>Trusted by innovators at</span>
              <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                 <div className="h-6 w-20 bg-gray-300 dark:bg-white/20 rounded"></div>
                 <div className="h-6 w-20 bg-gray-300 dark:bg-white/20 rounded"></div>
                 <div className="h-6 w-20 bg-gray-300 dark:bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}