import React from 'react';

// 简单的图标组件 (可用 lucide-react 替换)
const IconRobot = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconZap = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const features = [
  {
    title: "Autonomous Agents",
    desc: "不再只是聊天。2026 年的 AI 能自主拆解复杂任务，调用软件工具，独立完成工作流。",
    icon: <IconZap />,
    gradient: "from-yellow-400 to-orange-500",
    colSpan: "md:col-span-2"
  },
  {
    title: "Multimodal Fusion",
    desc: "看懂视频，听懂语气，生成图文音视频。感官的全面融合让交互更自然。",
    icon: <IconEye />,
    gradient: "from-purple-400 to-pink-500",
    colSpan: "md:col-span-1"
  },
  {
    title: "Embodied AI",
    desc: "AI 拥有身体。机器人走出实验室，在制造、医疗、家庭场景中创造实体价值。",
    icon: <IconRobot />,
    gradient: "from-blue-400 to-cyan-500",
    colSpan: "md:col-span-2"
  }
];

export default function AIFeatures() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Core Capabilities in 2026</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">技术奇点临近，三大引擎驱动未来。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 ${feature.colSpan}`}
            >
              {/* 背景渐变光晕 */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br ${feature.gradient} opacity-20 blur-[80px] group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative h-full p-8 flex flex-col justify-between z-10">
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
              
              {/* 边框高光效果 */}
              <div className="absolute inset-0 rounded-3xl border border-slate-200 dark:border-slate-700 pointer-events-none group-hover:border-transparent transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}