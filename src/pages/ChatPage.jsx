import React,{useState} from 'react';
import ChatInput from '@/components/ui/ChatInput';
import Header from '@/components/ui/Header';
import ChatContainer from '@/components/ui/ChatContainer';
import SettingsPanel from '@/components/ui/SettingsPanel';
import { Settings } from 'lucide-react'; // 或者其他打开按钮
export default function ChatPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <div className="flex h-screen w-screen flex-col">
      {/* 1. 独立背景层：应用模糊和渐变 */}
      <div className="absolute inset-0 z-0 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r from-black via-pink-800 to-blue-800 bg-size-[200%_500%] blur-7xl filter"></div>
      <Header />
      <div className="relative mx-auto flex w-screen justify-center gap-4">
        <div className="fixed top-1/6 left-2 h-1/2 w-1/7 overflow-hidden rounded-2xl border border-white/30 bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300">
          History
        </div>


      {/* 设置面板 */}
      <SettingsPanel 
        isOpen={true} 
        onClose={() => setIsSettingsOpen(false)} 
      />


        <div className="flex h-screen w-3/5 flex-col">
          <ChatContainer />
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
