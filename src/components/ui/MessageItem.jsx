import React, { useState, useEffect, useRef, useCallback } from 'react';
import { renderMarkdown } from '@/utils/markdown.js';
import {
  ReloadOutlined,
  CopyOutlined,
  CheckOutlined,
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
} from '@ant-design/icons';
import { useChatStore } from '@/stores/useChatStore';

const MessageItem = ({ message, isLastAssistantMessage = false, onRegenerate }) => {
  if (!message) return null;

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

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  const isLoading = useChatStore((s) => s.isLoading);
  const contentRef = useRef(null);

  const renderedContent = renderMarkdown(safeMessage.content);
  const renderedReasoning = message.reasoning_content
    ? renderMarkdown(safeMessage.reasoning_content)
    : '';
  const isUser = safeMessage.role === 'user';
  const isAssistant = safeMessage.role === 'assistant';
  const isAssistantLoading = isAssistant && isLoading;

  const toggleReasoning = () => {
    setIsReasoningExpanded((prev) => !prev);
  };

  const handleCodeCopy = useCallback((event) => {
    const copyBtn = event.currentTarget;
    const codeBlock = copyBtn.closest('.code-block');
    if (!codeBlock) return;
    const codeElement = codeBlock.querySelector('pre code');
    if (!codeElement) return;
    navigator.clipboard.writeText(codeElement.textContent).then(() => {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span style="color:#4ade80">已复制!</span>';
      setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
    }).catch(() => {});
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeMessage.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (_) {}
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleThemeToggle = useCallback((event) => {
    const btn = event.currentTarget;
    const codeBlock = btn.closest('.code-block');
    if (!codeBlock) return;
    codeBlock.classList.toggle('theme-light');
    const lightIcon = btn.getAttribute('data-light-icon');
    const darkIcon = btn.getAttribute('data-dark-icon');
    const isLight = codeBlock.classList.contains('theme-light');
    btn.innerHTML = isLight ? lightIcon : darkIcon;
  }, []);

  const handleRegenerateClick = () => {
    if (onRegenerate) onRegenerate(safeMessage);
  };

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
    observer.observe(contentRef.current, { childList: true, subtree: true });
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
  }, [renderedContent, renderedReasoning]);

  return (
    <div
      className={`group relative mb-6 flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative flex max-w-[85%] flex-col ${isUser ? 'items-end' : 'items-start'}`}
      >
        {isAssistantLoading && !safeMessage.content && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/50">
            <span className="animate-pulse">内容生成中...</span>
          </div>
        )}

        {isAssistant && safeMessage.reasoning_content && (
          <button
            type="button"
            onClick={toggleReasoning}
            aria-expanded={isReasoningExpanded}
            className="mb-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/15"
          >
            <span>深度思考</span>
            <span className={`transition-transform duration-200 ${isReasoningExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        )}

        {isAssistant && isReasoningExpanded && safeMessage.reasoning_content && (
          <div className="mb-2 border-l-2 border-white/10 px-4 py-1 text-sm text-white/50">
            <div
              className="prose prose-sm max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: renderedReasoning }}
            />
          </div>
        )}

        {renderedContent && (
          <div
            className={`relative w-fit overflow-hidden rounded-2xl px-4 py-3 text-base leading-relaxed ${
              isUser
                ? 'rounded-br-md bg-blue-600/25 text-white/90 backdrop-blur-sm border border-blue-400/30'
                : 'rounded-bl-md bg-white/10 text-white/90 backdrop-blur-sm border border-white/10'
            }`}
          >
            <div
              ref={contentRef}
              className={`markdown-body max-w-none ${isUser ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* AI 消息操作栏 */}
            {isAssistant && !safeMessage.loading && (
              <div className="mt-2.5 flex items-center gap-0.5 border-t border-white/10 pt-2.5">
                {isLastAssistantMessage && (
                  <ActionBtn onClick={handleRegenerateClick} title="重新生成">
                    <ReloadOutlined />
                  </ActionBtn>
                )}
                <ActionBtn onClick={handleCopy} title={isCopied ? '已复制' : '复制'} active={isCopied}>
                  {isCopied ? <CheckOutlined /> : <CopyOutlined />}
                </ActionBtn>
                <ActionBtn onClick={handleLike} title="有帮助" active={isLiked}>
                  {isLiked ? <LikeFilled /> : <LikeOutlined />}
                </ActionBtn>
                <ActionBtn onClick={handleDislike} title="没有帮助" active={isDisliked}>
                  {isDisliked ? <DislikeFilled /> : <DislikeOutlined />}
                </ActionBtn>
              </div>
            )}
          </div>
        )}

        {/* 用户消息操作栏 */}
        {isUser && safeMessage.content && (
          <div className="mt-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ActionBtn onClick={handleCopy} title={isCopied ? '已复制' : '复制'} active={isCopied}>
              {isCopied ? <CheckOutlined /> : <CopyOutlined />}
            </ActionBtn>
          </div>
        )}
      </div>
    </div>
  );
};

function ActionBtn({ onClick, title, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-md p-1.5 text-xs transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:bg-white/10 hover:text-white/80'
      }`}
    >
      {children}
    </button>
  );
}

export default React.memo(MessageItem);
