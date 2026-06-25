import React, { useRef, useState} from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
import {
  InboxOutlined,
  UploadOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { Input, Upload, message, Button, Dropdown, Space } from 'antd';

// ChatInput组件
const ChatInput = ({ loading, onSend }) => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // 状态管理
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState([]);

  // 引用file input 元素以变编程式出发点击
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // 处理发送信息
  const handleSend = () => {
    const trimmedText = inputValue.trim();
    if((!trimmedText && fileList.length === 0 ) || loading) return;

    // 构建消息对象
    const messageContent = {
      text:trimmedText,
      files:[...fileList],//复制一份文件列表
    };

    onSend(messageContent);
    // 清空状态
    setInputValue('');
    setFileList([]);

  };
  const handleNewline = (e) => {
    e.preventDefault();
    setInputValue((prev) => prev + '\n');
  };
  // 键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handleNewline(e);
      } else {
        e.preventDefault();
        // 发出
        handleSend();
      }
    }
  };

  const ImageAllowedTypes = [
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp',
  ];

  // 图片类型判断
  const Imageprops = {
    beforeUpload: (file) => {
      const isImage = ImageAllowedTypes.includes(file.type);
      if (!isImage) {
        message.error(`${file.name} is not supported`);
        return isImage;
      } else {
        return isImage || Upload.LIST_IGNORE;
      }
    },
    onChange: () => {},
  };

  const FileAllowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  // 文件类型判断
  const Fileprops = {
    beforeUpload: (file) => {
      const isFile = FileAllowedTypes.includes(file.type);
      if (!isFile) {
        message.error(`${file.name} is not supported`);
        return isFile;
      } else {
        return isFile || Upload.LIST_IGNORE;
      }
    },
    onChange: () => {},
  };

  const items = [
    {
      key: '1',
      label: (
        <Upload {...Imageprops}>
          <Button icon={<UploadOutlined />}>支持 JPEG/JPG/PNG</Button>
        </Upload>
      ),
    },
    {
      key: '2',
      label: (
        <Upload {...Fileprops}>
          <Button icon={<UploadOutlined />}>支持 文件PDF/Word/Excel</Button>
        </Upload>
      ),
    },
  ];

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 w-5xl max-w-full rounded-3xl border border-white/30 bg-white/30 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300">
      {/* 输入框 */}
      <label htmlFor="tour-chat-input" className="sr-only">
        输入消息
      </label>
      <textarea
        id="tour-chat-input"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        placeholder="输入消息,Enter发送,Shift+Enter换行,最大行数为6"
        onKeyDown={handleKeyDown}
        rows={1}
        aria-multiline="true"
        className="w-full bg-transparent border-none resize-none outline-none text-white placeholder-gray-100 min-h-6 max-h-37.5 overflow-y-auto custom-scrollbar-thin"
        style={{
          minHeight: '1.5rem',
          maxHeight: '9rem',
          fieldSizing: 'content' }}
      />
      {/* 底部工具框 */}
      <div className="file flex h-auto w-full justify-end gap-4 border-none pt-4">
        <Dropdown menu={{ items }} placement="top" className="pt-4 bg-transparent">
          <button
            type="button"
            className="cursor-pointer"
            aria-label="添加附件"
            aria-haspopup="menu"
          >
            <PaperClipOutlined />
          </button>
        </Dropdown>
        <button
          type="button"
          className="cursor-pointer"
          onClick={handleSend}
          aria-label="发送"
          disabled={loading || (!inputValue.trim() && fileList.length === 0)}
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
