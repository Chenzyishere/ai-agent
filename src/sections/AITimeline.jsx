import React from 'react';

const milestones = [
  {
    year: '1950',
    title: '图灵测试提出',
    desc: '艾伦·图灵提出“机器能思考吗？”，奠定了人工智能的理论基石。',
    color: 'from-gray-500 to-gray-700'
  },
  {
    year: '2012',
    title: '深度学习爆发',
    desc: 'AlexNet 在 ImageNet 竞赛中获胜，CNN 引领计算机视觉革命。',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    year: '2023',
    title: '生成式 AI 元年',
    desc: 'LLM 大模型爆发，ChatGPT 让 AI 走进大众生活，文本生成能力质变。',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    year: '2025',
    title: 'AI Agent 时代',
    desc: '从“对话”转向“行动”。AI 能够自主规划任务、使用工具，Token 消耗量激增 300 倍。',
    color: 'from-pink-500 to-rose-500',
    highlight: true
  },
  {
    year: '2026',
    title: '具身智能与多模态',
    desc: 'AI 拥有“身体”和“感官”。机器人进入工厂与家庭，多模态模型实现看、听、说深度融合。',
    color: 'from-orange-400 to-yellow-400',
    highlight: true
  }
];

export default function AITimeline() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Evolution of Intelligence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">从数学逻辑到物理实体，回顾 AI 发展的关键转折点。</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* 中心线 */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-gray-700 to-transparent md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* 内容卡片 */}
                <div className="ml-12 md:ml-0 md:w-1/2 px-4">
                  <div className={`group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-${item.color.split('-')[1]}-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] ${item.highlight ? 'ring-1 ring-white/10 bg-slate-800/80' : ''}`}>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r ${item.color} text-white mb-3`}>
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* 中心点 */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-slate-950 border-4 border-gray-600 -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}