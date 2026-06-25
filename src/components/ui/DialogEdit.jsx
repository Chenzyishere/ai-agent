import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Input, message } from 'antd';
import { useChatStore } from '@/stores/useChatStore';
import { X, AlertTriangle } from 'lucide-react';

export function ConfirmDialog({ visible, title, children, onCancel, onConfirm, danger }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-[#1e1640]/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onCancel} className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-5 text-sm text-white/70">{children}</div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
            取消
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${danger ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'}`}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

const DialogEdit = forwardRef((_props, ref) => {
  const chatStore = useChatStore();
  const [visible, setVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [convId, setConvId] = useState(null);
  const [type, setType] = useState('edit');

  useImperativeHandle(ref, () => ({
    openDialog: (conversationId, dialogType = 'edit') => {
      setConvId(conversationId);
      setType(dialogType);
      if (dialogType === 'edit') {
        const conv = chatStore.conversations.find((c) => c.id === conversationId);
        setInputTitle(conv?.title || '');
      } else {
        setInputTitle('');
      }
      setVisible(true);
    },
  }));

  const close = () => {
    setVisible(false);
    setInputTitle('');
  };

  const handleConfirm = async () => {
    if (type === 'edit') {
      if (!inputTitle.trim()) {
        message.warning('标题不能为空');
        return;
      }
      try {
        await chatStore.updateConversationTitle(convId, inputTitle.trim());
        message.success('修改成功');
      } catch (_) {
        message.error('修改失败');
      }
    } else {
      try {
        await chatStore.deleteConversation(convId);
        message.success('已删除');
      } catch (_) {
        message.error('删除失败');
      }
    }
    close();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-[#1e1640]/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-base font-semibold text-white">
            {type === 'edit' ? '编辑名称' : '删除对话'}
          </h3>
          <button onClick={close} className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {type === 'edit' ? (
            <Input
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="输入新名称"
              maxLength={50}
              showCount
              autoFocus
              onPressEnter={handleConfirm}
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.12)',
                borderRadius: '10px',
                height: '42px',
                color: '#fff',
              }}
              styles={{ input: { color: '#fff' } }}
            />
          ) : (
            <div className="flex items-start gap-3 text-white/70">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">确定要删除这个对话吗？</p>
                <p className="text-xs text-white/40 mt-1">删除后将无法恢复</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={close} className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
            取消
          </button>
          <button
            onClick={handleConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              type === 'delete'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            }`}
          >
            {type === 'edit' ? '确定' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default DialogEdit;
