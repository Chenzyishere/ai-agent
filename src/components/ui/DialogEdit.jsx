import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Input, Button, message, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useChatStore } from '@/stores/useChatStore'; // 确保路径正确

/**
 * 对话操作对话框 (编辑/删除)
 * 使用 forwardRef 以便父组件调用 openDialog 方法
 */
const dialogEdit = forwardRef((props, ref) => {
  const chatStore = useChatStore();

  // 状态管理 (对应 Vue 的 ref)
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [dialogType, setDialogType] = useState('edit'); // 'edit' | 'delete'

  // 暴露给父组件的方法 (对应 Vue 的 defineExpose)
  useImperativeHandle(ref, () => ({
    openDialog: (conversationId, type = 'edit') => {
      setCurrentConversationId(conversationId);
      setDialogType(type);
      
      if (type === 'edit') {
        const conversation = chatStore.conversations.find(
          (c) => c.id === conversationId
        );
        setInputTitle(conversation?.title || '');
      } else {
        setInputTitle('');
      }
      
      setDialogVisible(true);
    },
  }));

  // 取消操作
  const handleCancel = () => {
    setDialogVisible(false);
    setInputTitle('');
  };

  // 确认操作
  const handleConfirm = async () => {
    if (dialogType === 'edit') {
      if (!inputTitle.trim()) {
        message.warning('标题不能为空');
        return;
      }
      try {
        await chatStore.updateConversationTitle(currentConversationId, inputTitle.trim());
        message.success('修改成功');
      } catch (error) {
        message.error('修改失败');
        console.error(error);
      }
    } else {
      // 删除模式
      try {
        await chatStore.deleteConversation(currentConversationId);
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败');
        console.error(error);
      }
    }
    
    setDialogVisible(false);
    setInputTitle('');
  };

  return (
    <Modal
      title={dialogType === 'edit' ? '编辑对话名称' : '确定删除对话'}
      open={dialogVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="confirm"
          type={dialogType === 'edit' ? 'primary' : 'primary'} 
          danger={dialogType === 'delete'} // 删除按钮显示红色
          onClick={handleConfirm}
        >
          {dialogType === 'edit' ? '确定' : '删除'}
        </Button>,
      ]}
      width={400} // 对应 Vue 的 30% (约等于 400-500px)
    >
      {dialogType === 'edit' ? (
        <div className="pt-2">
          <Input
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="请输入对话名称"
            maxLength={50}
            showCount
            autoFocus // 自动聚焦
            onPressEnter={handleConfirm} // 回车确认
          />
        </div>
      ) : (
        <div className="delete-warning flex items-center gap-2 text-gray-600 py-2">
          <ExclamationCircleFilled className="text-red-500 text-xl" />
          <span>删除后，聊天记录将不可恢复</span>
        </div>
      )}
    </Modal>
  );
});

export default dialogEdit;