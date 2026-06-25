import React, { useState, useRef } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import DialogEdit from '@/components/ui/DialogEdit';
import { X, MessageSquare, Plus, Edit3, Trash2 } from 'lucide-react';

const HistoryChat = ({ isOpen, onClose, currentTitle }) => {
  const chatStore = useChatStore();
  const dialogEditRef = useRef(null);

  const handleNewChat = () => {
    chatStore.createConversation();
  };

  const handleSwitchChat = (conversationId) => {
    chatStore.switchConversation(conversationId);
  };

  const formatTitle = (title) => {
    if (!title) return '新对话';
    return title.length > 6 ? title.slice(0, 6) + '...' : title;
  };

  const handleEditClick = (id, e) => {
    e.stopPropagation();
    dialogEditRef.current?.openDialog(id, 'edit');
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    dialogEditRef.current?.openDialog(id, 'delete');
  };

  const conversations = chatStore.conversations || [];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col w-full h-full border-white/15 bg-[#1e1640]/85 backdrop-blur-2xl shadow-2xl transition-all duration-300 md:inset-auto md:top-1/2 md:-translate-y-1/2 md:left-4 md:w-72 md:h-[60vh] md:max-h-[60vh] md:rounded-2xl md:border ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          对话列表
        </h2>
        <button onClick={onClose} className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 当前标题 */}
      <div className="shrink-0 px-5 py-3 text-sm text-white/50 border-b border-white/5 truncate" title={currentTitle}>
        当前: <span className="text-white/80">{currentTitle}</span>
      </div>

      {/* 新对话按钮 */}
      <div className="shrink-0 px-4 py-3">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-purple-400/40 hover:text-purple-300 hover:bg-purple-500/10"
        >
          <Plus className="w-4 h-4" />
          新对话
        </button>
      </div>

      {/* 历史列表 */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-2 pb-2">
        <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-white/25 shrink-0">
          历史对话
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar-thin space-y-0.5">
          {conversations.map((conv) => {
            const isActive = conv.id === chatStore.currentConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => handleSwitchChat(conv.id)}
                className={`group w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-500/20 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <span className="truncate text-sm" title={conv.title}>
                  {formatTitle(conv.title)}
                </span>
                <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  <span
                    onClick={(e) => handleEditClick(conv.id, e)}
                    className="rounded p-1 text-white/30 hover:text-white/80 hover:bg-white/10 cursor-pointer"
                    role="button"
                    title="编辑"
                  >
                    <Edit3 className="w-3 h-3" />
                  </span>
                  <span
                    onClick={(e) => handleDeleteClick(conv.id, e)}
                    className="rounded p-1 text-white/30 hover:text-red-400 hover:bg-white/10 cursor-pointer"
                    role="button"
                    title="删除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                </span>
              </div>
            );
          })}

          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-xs text-white/25">暂无历史对话</p>
            </div>
          )}
        </div>
      </div>

      <DialogEdit ref={dialogEditRef} />
    </div>
  );
};

export default HistoryChat;
