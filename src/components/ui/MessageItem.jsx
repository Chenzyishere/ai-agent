import React, { useState, useEffect, useRef, computed } from 'react';
import { renderMarkdown } from '@/utils/markdown.js';
import {
  InboxOutlined,
  UploadOutlined,
  PaperClipOutlined,
  SendOutlined,
  ReloadOutlined,
  CopyOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';

// @param {Object} message; -消息对象{role,content,files,loading,reasoning_content,completion_tokens,speed}
// @param {boolean} isLastAssistantMessage -是否为最后一条AI信息
// @param {function} onRegenerate -重新生成回调

const MessageItem = ({
  message,
  isLastAssistantMessage = false,
  onRegenerate,
}) => {
  // 状态管理
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);

  const contentRef = useRef(null);

  // 计算属性
  const renderedContent = renderMarkdown(message.content || '')
  const renderedReasoning = message.reasoning_content ? renderMarkdown(message.reasoning_content) : ''
  // const renderedContent = ' this is markdown content';
  // const renderedReasoning = 'this is reasoning';

  // 切换深度思考展开/折叠
  const toggleReasoning = () => {
    setIsReasoningExpanded((prev) => !prev);
  };

  // 处理代码块复制
  const handleCodeCopy = async (event) => {
    const copyBtn = event.currentTarget;
    const codeBlock = copyBtn.closest('.code-block');
    if (!codeBlock) return;

    const codeElement = codeBlock.querySelector('pre code');
    if (!codeElement) return;

    try {
      await navigator.clipboard.writeText(codeElement.textContent);
      // 可以在这里添加一个短暂的 "已复制" 提示反馈
      const originalIcon = copyBtn.querySelector('img').src;
      // 模拟成功图标切换 (可选)
      // copyBtn.querySelector('img').src = successIcon
      setTimeout(() => {
        // copyBtn.querySelector('img').src = originalIcon
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 处理整体消息复制
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
    // 这里可以调用 API 记录反馈
  };

  // 处理点踩
  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
    // 这里可以调用 API 记录反馈
  };

  // 处理重新生成
  const handleRegenerate = () => {
    onRegenerate?.(message);
  };

  // 监听 DOM 变化以绑定代码块事件
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const codeBlocks = contentRef.current.querySelectorAll('.code-block');
          codeBlocks.forEach((block) => {
            const copyBtn = block.querySelector('[data-action="copy"]');
            const themeBtn = block.querySelector('[data-action="theme"]');

            if (copyBtn && !copyBtn._hasListener) {
              copyBtn.addEventListener('click', handleCodeCopy);
              copyBtn._hasListener = true;
            }
            if (themeBtn && !themeBtn._hasListener) {
              themeBtn.addEventListener('click', handleThemeToggle);
              themeBtn._hasListener = true;
            }
          });
        }
      });
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
    });

    // 清理函数
    return () => {
      observer.disconnect();
      const codeBlocks = contentRef.current?.querySelectorAll('.code-block');
      codeBlocks?.forEach((block) => {
        const copyBtn = block.querySelector('[data-action="copy"]');
        const themeBtn = block.querySelector('[data-action="theme"]');
        if (copyBtn?._hasListener) {
          copyBtn.removeEventListener('click', handleCodeCopy);
          delete copyBtn._hasListener;
        }
        if (themeBtn?._hasListener) {
          themeBtn.removeEventListener('click', handleThemeToggle);
          delete themeBtn._hasListener;
        }
      });
    };
  }, [renderedContent, renderedReasoning]); // 依赖内容渲染完成

  // const isUser = message.role === 'user'
  const isUser = 'user';
  // const isAssistantLoading = message.loading && message.role === 'assistant'
  const isAssistantLoading = false;

  return (
    <div>
      {/* 加载中状态 */}
      {isAssistantLoading && (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
        <span>内容生成中...</span>
      </div>
      )}

      {/* 深度思考开关 */}
      {!isAssistantLoading &&(
      <div
        onClick={toggleReasoning}
        className="mb-2 ml-4 flex w-fit cursor-pointer items-center gap-1 rounded bg-blue-50 px-2 py-1 transition-colors hover:bg-blue-100"
      >
        {/* <img src={thinkingIcon} alt="thinking" className="h-3.5 w-3.5" /> */}
        <span className="text-sm text-blue-600">深度思考</span>
        <span
          className={`text-xs text-blue-600 transition-transform duration-200 ${isReasoningExpanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </div>
      )}

      {/* 深度思考内容 */}
      {isReasoningExpanded && !isAssistantLoading && (
      <div className="markdown-body mb-2 ml-4 border-l-4 border-gray-300 bg-white px-4 py-0 text-sm leading-relaxed text-gray-500" >
        This is the reasoning bubble
      </div>)}

      {/* 消息主体气泡 */}
      {!isAssistantLoading && (
      <div
        className={`markdown-body block w-full overflow-hidden rounded-2xl p-3 text-base leading-relaxed wrap-break-word`}
      >
        this is the main bubble!
        {/* 操作按钮区域 */}
        <div className="mt-2 flex items-center gap-2 pl-4">
          <button>
            <ReloadOutlined />
            <span className='hidden'>Regenerate</span>
          </button>
          <button>
            <CopyOutlined />
            <span className='hidden'>Copy</span>
          </button>
          <button>
            <LikeOutlined />
            <span className='hidden'>Like</span>
          </button>
          <button>
            <DislikeOutlined />
            <span className='hidden'>Dislike</span>
          </button>
          <span>tokens:,Speed:</span>
        </div>
      </div>
      )}
    </div>
  );
};

export default MessageItem;
