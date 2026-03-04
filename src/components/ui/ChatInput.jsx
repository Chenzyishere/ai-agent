import React, { useRef, useState } from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
import {
  InboxOutlined,
  UploadOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { Input, Upload, message, Button, Dropdown, Space } from 'antd';
const { TextArea } = Input;
const { Dragger } = Upload;

// ChatInput组件
const ChatInput = ({ loading = false, onSend }) => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // 状态管理
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleSend = () => {
    console.log(123);
  };
  const handleNewline = (e) => {
    console.log(e);
    e.preventDefault();
    setInputValue((prev) => prev + '/n');
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
        //提示错误
        message.error(`${file.name} is not supported`);
        alert('不是合法的image');
        console.log('不是合法的image');
        return isImage;
      } else {
        // 提示正确
        console.log('是合法的图，开始上传');
        return isImage || Upload.LIST_IGNORE;
      }
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  // 文件类型判断
  const Fileprops = {
    beforeUpload: (file) => {
      const isFile = FileAllowedTypes.includes(file.type);
      if (!isImage) {
        //提示错误File
        message.error(`${file.name} is not supported`);
        alert('不是合法的file');
        console.log('不是合法的file');
        return isFile;
      } else {
        // 提示正确
        console.log('是合法的file，开始上传');
        return isFile || Upload.LIST_IGNORE;
      }
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
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
    <div className="fixed bottom-2 left-1/2 w-7xl max-w-4/5 -translate-x-1/2 rounded-3xl border border-white/30 bg-white/30 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300">
      {/* 输入框 */}
      <textarea
        ref={textareaRef}
        placeholder="输入消息,Enter发送,Shift+Enter换行，最大行数为6"
        onKeyDown={handleKeyDown}
        rows={1}
        className='w-full focus:border-none p-3'
      />
      {/* 底部工具框 */}
      <div className="file flex h-auto w-full justify-end gap-4 border-none pt-4">
        <Dropdown menu={{ items }} placement="top" className="pt-4">
          <button>
            <PaperClipOutlined />
          </button>
        </Dropdown>
        <button>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
