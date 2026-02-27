import React, { useState, useEffect, useRef } from 'react';
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

export default function ChatMessage() {



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
    const [isAssistantLoading, setIsAssistantLoading] = useState(true);

      const contentRef = useRef(null);
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

    // 切换深度思考展开/折叠
    const toggleReasoning = () => {
      setIsReasoningExpanded((prev) => !prev);
    };
  };

  return (
    <div>
      {/* 加载中状态 */}
      {isAssistantLoading && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
          <span>内容生成中...</span>
        </div>
      )}

      {/* 深度思考开关 */}
      {message.reasoning_content && !isAssistantLoading && (
        <div
          onClick={toggleReasoning}
          className="mb-2 ml-4 flex w-fit cursor-pointer items-center gap-1 rounded bg-blue-50 px-2 py-1 transition-colors hover:bg-blue-100"
        >
          <img src={thinkingIcon} alt="thinking" className="h-3.5 w-3.5" />
          <span className="text-sm text-blue-600">深度思考</span>
          <span
            className={`text-xs text-blue-600 transition-transform duration-200 ${isReasoningExpanded ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
      )}

      {/* 深度思考内容 */}
      {message.reasoning_content &&
        isReasoningExpanded &&
        !isAssistantLoading && (
          <div
            className="markdown-body mb-2 ml-4 border-l-4 border-gray-300 bg-white px-4 py-0 text-sm leading-relaxed text-gray-500"
            dangerouslySetInnerHTML={{ __html: renderedReasoning }}
          />
        )}
      <div
        className={`markdown-body block w-full overflow-hidden rounded-2xl p-3 text-base leading-relaxed wrap-break-word ${isUser ? 'bg-gray-100' : 'bg-white'}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      >
        {/* 操作按钮区域 */}
        <div className="mt-2 flex items-center gap-2 pl-4">
          <button>
            <ReloadOutlined />
            <span>Regenerate</span>
          </button>
          <button>
            <CopyOutlined />
            <span>Copy</span>
          </button>
          <button>
            <likeOutlined />
            <span>Like</span>
          </button>
          <button>
            <DislikeOutlined />
            <span>Dislike</span>
          </button>
          <span>tokens:,Speed:</span>
        </div>
      </div>
    </div>
  );
}
