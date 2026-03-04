import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { 
  X, 
  Settings, 
  HelpCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  ChevronDown 
} from 'lucide-react';
/**
 * 历史记录组件
 * @param {boolean} isOpen - 控制显示
 * @param {function} onClose - 关闭回调
 */

const HistoryChat = ({ isOpen, onClose }) => {
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

  // 打开编辑/删除对话框
  const openDialog = (id, type) => {
    if (dialogEditRef.current) {
      dialogEditRef.current.openDialog(id, type);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="fixed top-1/6 left-2 h-1/2 w-1/7 overflow-hidden rounded-2xl border border-white/30 bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300">

            {/* 头部 */}
        <div className="flex items-center justify-between p-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            历史对话
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


          {/* 新对话按钮 */}
          <div className="py-2">
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-none bg-transparent px-4 py-2 text-sm text-white hover:bg-gray-800"
              onClick={handleNewChat}
            >
              <span>新对话</span>
            </button>
          </div>


          {/* 历史列表 */}
          <div className="py-2">
            <div className="flex h-10 w-full cursor-pointer items-center gap-2 border-none bg-transparent px-4 py-2 text-sm text-white">
              历史对话
            </div>

            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto">
              {chatStore.conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative flex cursor-pointer items-center justify-between px-4 py-2 transition-colors duration-200 ${
                    conversation.id === chatStore.currentConversationId
                      ? 'bg-[#e5e7eb]'
                      : 'hover:bg-[#e5e7eb]'
                  }`}
                  onClick={() => handleSwitchChat(conversation.id)}
                >
                  {/* 选中状态的左侧蓝条 */}
                  {conversation.id === chatStore.currentConversationId && (
                    <div className="absolute top-0 bottom-0 left-0 w-0.75 rounded-r bg-[#3f7af1]" />
                  )}

                  {/* 左侧内容 */}
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                      className={`truncate text-sm ${
                        conversation.id === chatStore.currentConversationId
                          ? 'font-medium text-[#3f7af1]'
                          : 'text-[#374151]'
                      }`}
                      title={conversation.title}
                    >
                      {formatTitle(conversation.title)}
                    </span>
                  </div>

                  {/* 右侧操作按钮 (悬停显示) */}
                  <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      className="w-3.6 h-3.6 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 hover:brightness-75"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(conversation.id, 'edit');
                      }}
                      title="编辑"
                    ></button>
                    <button
                      className="w-3.6 h-3.6 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 hover:brightness-75"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(conversation.id, 'delete');
                      }}
                      title="删除"
                    ></button>
                  </div>
                </div>
              ))}

              {(!chatStore.conversations ||
                chatStore.conversations.length === 0) && (
                <div className="px-4 py-2 text-center text-xs text-gray-400">
                  暂无历史记录
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HistoryChat;
