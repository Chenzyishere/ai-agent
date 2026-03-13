import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className='relative mt-5'>
      {/* 液态玻璃容器 */}
      <div className='max-w-7xl mx-auto px-4 pt-5 pb-12'>
        <div className='relative 
                        bg-black backdrop-blur-xl 
                        border border-white/20 
                        rounded-3xl 
                        shadow-[0_8px_32px_rgba(0,0,0,0.15)] 
                        overflow-hidden'>
          
          {/* 液态渐变光效 */}
          {/* <div className='absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-blue-500/15 
                          animate-gradient-flow 
                          bg-[length:200%_200%]'></div> */}
          
          {/* 液态光斑装饰 */}
          <div className='absolute -top-20 -left-20 w-60 h-60 
                          bg-purple-500/20 rounded-full blur-3xl 
                          animate-pulse'></div>
          <div className='absolute -bottom-20 -right-20 w-60 h-60 
                          bg-pink-500/20 rounded-full blur-3xl 
                          animate-pulse'></div>
          
          {/* 顶部光泽高光 */}
          <div className='absolute top-0 left-0 right-0 h-px 
                          bg-gradient-to-r from-transparent via-white/40 to-transparent'></div>
          
          {/* 内容层 */}
          <div className='relative z-10'>
            
            {/* 上部分：多列布局 */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8 lg:p-10'>
              
              {/* 品牌信息 */}
              <div>
                <h3 className='text-white text-xl font-bold mb-4 
                               bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent
                               drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'>
                  知微AI平台
                </h3>
                <p className='text-gray-300 text-sm leading-relaxed'>
                  打造给用户提供优秀体验的AI平台。
                </p>
                
                {/* 社交媒体图标 */}
                <div className='flex space-x-3 mt-6'>
                  <a href='https://github.com' target='_blank' rel='noopener noreferrer' 
                     className='w-10 h-10 flex items-center justify-center 
                                bg-white/10 rounded-full 
                                border border-white/20 
                                hover:bg-white/20 hover:scale-110 
                                transition-all duration-300 
                                hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'>
                    <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'/>
                    </svg>
                  </a>
                  <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' 
                     className='w-10 h-10 flex items-center justify-center 
                                bg-white/10 rounded-full 
                                border border-white/20 
                                hover:bg-white/20 hover:scale-110 
                                transition-all duration-300 
                                hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'>
                    <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
                    </svg>
                  </a>
                  <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' 
                     className='w-10 h-10 flex items-center justify-center 
                                bg-white/10 rounded-full 
                                border border-white/20 
                                hover:bg-white/20 hover:scale-110 
                                transition-all duration-300 
                                hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'>
                    <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* 快速链接 */}
              <div>
                <h4 className='text-white font-semibold mb-4 
                               drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'>
                  快速链接
                </h4>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a href='/' className='text-gray-300 hover:text-white 
                                           transition-all duration-300 
                                           hover:translate-x-1 inline-block
                                           hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href='/about' className='text-gray-300 hover:text-white 
                                                transition-all duration-300 
                                                hover:translate-x-1 inline-block
                                                hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      About
                    </a>
                  </li>
                  <li>
                    <a href='/services' className='text-gray-300 hover:text-white 
                                                   transition-all duration-300 
                                                   hover:translate-x-1 inline-block
                                                   hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Services
                    </a>
                  </li>
                  <li>
                    <a href='/contact' className='text-gray-300 hover:text-white 
                                                  transition-all duration-300 
                                                  hover:translate-x-1 inline-block
                                                  hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* 资源链接 */}
              <div>
                <h4 className='text-white font-semibold mb-4 
                               drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'>
                  Resources
                </h4>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a href='/blog' className='text-gray-300 hover:text-white 
                                               transition-all duration-300 
                                               hover:translate-x-1 inline-block
                                               hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href='/docs' className='text-gray-300 hover:text-white 
                                               transition-all duration-300 
                                               hover:translate-x-1 inline-block
                                               hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href='/faq' className='text-gray-300 hover:text-white 
                                              transition-all duration-300 
                                              hover:translate-x-1 inline-block
                                              hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href='/support' className='text-gray-300 hover:text-white 
                                                  transition-all duration-300 
                                                  hover:translate-x-1 inline-block
                                                  hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'>
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* 联系方式 */}
              <div>
                <h4 className='text-white font-semibold mb-4 
                               drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'>
                  Contact
                </h4>
                <ul className='space-y-3 text-sm text-gray-300'>
                  <li className='flex items-center gap-2'>
                    <span className='text-lg'>📧</span>
                    <span className='hover:text-white transition'>hello@mywebsite.com</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-lg'>📱</span>
                    <span className='hover:text-white transition'>+1 (555) 123-4567</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-lg'>📍</span>
                    <span className='hover:text-white transition'>San Francisco, CA</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* 分隔线 */}
            <div className='relative mx-8 lg:mx-10'>
              <div className='border-t border-white/10'></div>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px 
                              bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
            </div>
            
            {/* 下部分：版权信息 */}
            <div className='p-8 lg:p-10'>
              <p className='text-center text-gray-400 text-sm'>
                © {currentYear} My Website. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}