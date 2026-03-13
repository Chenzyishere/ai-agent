import React, { useState, useEffect, useRef, useCallback } from 'react';
import { renderMarkdown } from '@/utils/markdown.js';
import {
  ReloadOutlined,
  CopyOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import { useChatStore } from '@/stores/useChatStore';

/**
 * @param {Object} props
 * @param {Object} props.message - 消息对象 {role, content, files, loading, reasoning_content, completion_tokens, speed}
 * @param {boolean} props.isLastAssistantMessage - 是否为最后一条 AI 信息 (用于显示重新生成按钮)
 * @param {function} props.onRegenerate - 重新生成回调 (如果未提供，则使用 Store 中的默认逻辑)
 */

const MessageItem = ({
  message,
  isLastAssistantMessage = false,
  onRegenerate,
}) => {
  if (!message) {
    return null;
  }

  // 确保 content 和 role 有默认值，防止 undefined 参与运算
  const safeMessage = {
    role: message.role || 'assistant',
    content: message.content || '',
    reasoning_content: message.reasoning_content || '',
    loading: message.loading || false,
    files: message.files || [],
    completion_tokens: message.completion_tokens,
    speed: message.speed,
    id: message.id,
  };

  // 1.本地状态
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  const {isLoading,setIsLoading} = useChatStore();
  // 2.引用
  const contentRef = useRef(null);
  // 4.计算属性(直接变量赋值)

  const renderedContent = renderMarkdown(safeMessage.content);
  const renderedReasoning = message.reasoning_content
    ? renderMarkdown(safeMessage.reasoning_content)
    : '';
  const isUser = safeMessage.role === 'user';
  const isAssistant = safeMessage.role === 'assistant';
  const isAssistantLoading = isAssistant && isLoading ? true :false;

  // 5.事件处理
  // 切换深度思考展开/折叠
  const toggleReasoning = () => {
    setIsReasoningExpanded((prev) => !prev);
  };

  // 处理代码块复制 (委托事件)
  const handleCodeCopy = useCallback((event) => {
    const copyBtn = event.currentTarget;
    const codeBlock = copyBtn.closest('.code-block');
    if (!codeBlock) return;

    const codeElement = codeBlock.querySelector('pre code');
    if (!codeElement) return;

    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        // 简单的视觉反馈
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="text-green-500">已复制!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
        }, 2000);
      })
      .catch((err) => console.error('复制失败:', err));
  }, []);

  // 处理整体消息复制
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeMessage.content);
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
  const handleRegenerateClick = () => {
    if (onRegenerate) {
      onRegenerate(safeMessage);
    }
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

  return (
    <div
      className={`group relative mb-8 flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* 3. 内容区域容器 */}
      {/* 用户：最大宽度限制，靠右 (ml-auto) */}
      {/* AI：最大宽度限制，靠左 (mr-auto) */}
      <div
        className={`relative flex max-w-[85%] flex-col ${isUser ? 'ml-12 items-end' : 'mr-12 items-start'}`}
      >
        {/* 加载中状态 */}
        {isAssistantLoading && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
            <span>内容生成中...</span>
          </div>
        )}

        {/* 深度思考开关 */}
        {isAssistant && safeMessage.reasoning_content && (
          <div
            onClick={toggleReasoning}
            className="mb-2 ml-4 flex w-fit cursor-pointer items-center gap-1 rounded bg-blue-50 px-2 py-1 transition-colors hover:bg-blue-100"
          >
            <span className="text-sm text-blue-600">深度思考</span>
            <span
              className={`text-xs text-blue-600 transition-transform duration-200 ${isReasoningExpanded ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </div>
        )}

        {/* 深度思考内容 */}
        {isAssistant && isReasoningExpanded && (
          <div className="markdown-body mb-2 border-l-4 border-gray-100 px-4 py-0 text-sm leading-relaxed text-gray-100">
            <div
              className="markdown-body prose prose-sm prose-indigo max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedReasoning }}
            />
          </div>
        )}

        {/* --- 4. 消息主体气泡--- */}
        {renderedContent && (
          <div
            className={`relative w-fit overflow-hidden rounded-2xl p-4 text-base leading-relaxed wrap-break-word shadow-sm ${
              isUser
                ? 'rounded-br-none bg-blue-600 text-white' // 用户：蓝色，右下角切角可选
                : 'rounded-bl-none border border-gray-100 bg-white text-gray-800' // AI：白色，左下角切角可选
            }`}
          >
            {/* 渲染 Markdown 内容 */}
            <div
              ref={contentRef}
              className={`markdown-body max-w-none ${
                isUser ? 'prose-invert' : 'prose'
              }`}
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
            {/* 操作按钮区域 */}
            {isAssistant && isLastAssistantMessage && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleRegenerateClick}
                  title="重新生成"
                  className="cursor-pointer transition-all hover:translate-0.5"
                >
                  <ReloadOutlined />
                </button>
                <button
                  onClick={handleCopy}
                  title="复制"
                  className="cursor-pointer transition-all hover:translate-0.5"
                >
                  <CopyOutlined />
                </button>
                <button
                  onClick={handleLike}
                  title="喜欢"
                  className="cursor-pointer transition-all hover:translate-0.5"
                >
                  <LikeOutlined />
                </button>
                <button
                  onClick={handleDislike}
                  title="不喜欢"
                  className="cursor-pointer transition-all hover:translate-0.5"
                >
                  <DislikeOutlined />
                </button>
                <span>tokens:{safeMessage.completion_tokens}</span>
                <span>speed:{safeMessage.speed}ms</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
