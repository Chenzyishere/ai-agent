import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import DialogEdit from '@/components/ui/DialogEdit';
import {
  X,
  Settings,
} from 'lucide-react';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
/**
 * 历史记录组件
 * @param {boolean} isOpen - 控制显示
 * @param {function} onClose - 关闭回调
 */

const HistoryChat = ({ isOpen, onClose, currentTitle }) => {
  const chatStore = useChatStore();
  const [isVisible, setIsVisible] = useState(false);
  const dialogEditRef = useRef(null);
  const wrapperRef = useRef(true);

  const handleNewChat = () => {
    chatStore.createConversation();
    setIsVisible(false);
  };

  const handleSwitchChat = (conversationId) => {
    chatStore.switchConversation(conversationId);
    setIsVisible(false);
  };

  const formatTitle = (title) => {
    if (!title) return '';
    return title.length > 4 ? title.slice(0, 4) + '...' : title;
  };

  const handleEditClick = (id, e) => {
    e.stopPropagation();
    dialogEditRef.current?.openDialog(id, 'edit');
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    dialogEditRef.current?.openDialog(id, 'delete');
  };

  return (
    <div className="relative z-50" ref={wrapperRef}>
  {/* 
    响应式逻辑：
    - 移动端 (默认): fixed w-full, h-full, rounded-none
    - 桌面端 (md:): fixed top-1/6 left-2, w-1/7, h-1/2, rounded-2xl
  */}
  <div className={`fixed inset-0 z-50 flex flex-col w-full h-full bg-white/30 shadow-2-xl backdrop-blur-xl shadow-2xl transition-all duration-300 md:top-1/6 md:left-2 md:h-1/2 md:w-1/7 md:rounded-2xl md:border md:border-white/30 md:bg-white/30 md:shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
    
    {/* 头部 */}
    <div className="flex shrink-0 items-center justify-between p-4 md:p-5 border-b border-white/10 md:border-none">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
        {/* 图标颜色适配：移动端深色文字，桌面端白色 */}
        <Settings className="h-5 w-5 text-white" />
        <span className="text-white">对话</span>
      </h2>
      <button
        onClick={(e) =>{
          if(onClose) onClose();  
        }}
        className="rounded-full p-2 text-gray-800 transition-colors hover:bg-gray-200 md:text-white md:hover:bg-gray-100/20"
        aria-label="关闭"
      >
        <X className="h-6 w-6 md:h-5 md:w-5" />
      </button>
    </div>

    {/* 标题区域 */}
    <div
      className="shrink-0 w-full cursor-pointer py-3 text-center text-white"
      title="ChatTitle"
    >
      <span className="block truncate px-4 text-sm font-medium">{currentTitle}</span>
    </div>

    {/* 新对话按钮 */}
    <div className="shrink-0 px-4 py-2">
      <button
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all active:scale-95 hover:bg-gray-50 hover:border-gray-300 md:h-10 md:border-none md:bg-transparent md:text-white md:shadow-none md:hover:bg-gray-800/50"
        onClick={handleNewChat}
      >
        <span>+ 新对话</span>
      </button>
    </div>

    {/* 历史列表区域 */}
    <div className="flex-1 overflow-hidden py-2">
      <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-white">
        历史对话
      </div>

      {/* 滚动容器 */}
      <div className="custom-scrollbar h-full overflow-y-auto pb-20 md:pb-2">
        {chatStore.conversations?.map((conversation) => (
          <div
            key={conversation.id}
            className={`group relative mx-2 mb-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition-colors group duration-200 md:mx-0 md:mb-0 md:rounded-none md:px-4 md:py-2 ${
              conversation.id === chatStore.currentConversationId
                ? 'bg-blue-50 md:bg-[#e5e7eb]'
                : 'hover:bg-gray-100 md:hover:bg-[#e5e7eb]'
            }`}
            onClick={() => handleSwitchChat(conversation.id)}
          >
            {/* 选中状态的左侧蓝条 (仅在桌面端显示，或移动端改为背景色区分) */}
            {conversation.id === chatStore.currentConversationId && (
              <div className="absolute top-0 bottom-0 left-0 hidden w-1 rounded-r bg-[#3f7af1] md:block" />
            )}

            {/* 左侧内容 */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className={`truncate text-sm ${
                  conversation.id === chatStore.currentConversationId
                    ? 'font-semibold text-[#3f7af1]'
                    : 'text-white group-hover:text-gray-500'
                }`}
                title={conversation.title}
              >
                {formatTitle(conversation.title)}
              </span>
            </div>

            {/* 右侧操作按钮 (悬停显示 - 移动端始终显示或点击后显示，这里简化为始终可见但透明度低，或 group-hover) */}
            {/* 移动端优化：由于没有 hover，建议始终显示图标或简化操作 */}
            <div className="flex gap-2 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-blue-100 hover:text-blue-600 md:h-5 md:w-5 md:bg-transparent md:p-0 md:opacity-50 md:hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(conversation.id, e);
                }}
                title="编辑"
              >
                <EditOutlined className="h-4 w-4 md:h-3 md:w-3" />
              </button>
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-red-500 transition-all hover:bg-red-100 md:h-5 md:w-5 md:bg-transparent md:p-0 md:opacity-50 md:hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(conversation.id, e);
                }}
                title="删除"
              >
                <DeleteOutlined className="h-4 w-4 md:h-3 md:w-3" />
              </button>
            </div>
          </div>
        ))}

        {(!chatStore.conversations || chatStore.conversations.length === 0) && (
          <div className="flex h-32 flex-col items-center justify-center px-4 text-center">
            <div className="mb-2 rounded-full bg-gray-100 p-3 text-gray-400">
              <Settings className="h-6 w-6" />
            </div>
            <p className="text-xs text-gray-400">暂无历史记录</p>
          </div>
        )}
        
        {/* 挂载对话框组件 */}
        <DialogEdit ref={dialogEditRef} />
      </div>
    </div>
    
    {/* 移动端底部安全区占位 (可选，防止内容被 Home Indicator 遮挡) */}
    <div className="h-safe-area-inset-bottom md:hidden"></div>
  </div>
</div>
  );
};

export default HistoryChat;
