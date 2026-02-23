import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
export default function ChatInput() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
      {/* 文件预览区域 */}
      <div className="file h-auto w-full bg-pink-100">
        <div className="w-full flex justify-start gap-3 relative overflow-hidden rounded-lg p-3">
          {/* 图片预览 */}
          <div className=" overflow-visible image relative h-10 w-10 bg-amber-50 group text-center
          ">
            图片
            {/* 删除按钮 */}
            <button
              onClick
              className="opacity-0 absolute top-0 right-0 -translate-y-2 translate-x-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/50 transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
          {/* 文件预览 */}
          <div className=" overflow-visible image relative h-10 w-10 bg-amber-50 group text-center
          ">
            文件
            {/* 删除按钮 */}
            <button
              onClick
              className="opacity-0 absolute top-0 right-0 -translate-y-2 translate-x-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/50 transition-all duration-200 hover:bg-black/70 group-hover:opacity-100"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 输入框 */}
      <textarea
        className="bg-black-100 w-full"
        placeholder="输入消息,Enter发送"
      />
    </div>
  );
}
