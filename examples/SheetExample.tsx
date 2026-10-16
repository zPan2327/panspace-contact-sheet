"use client";

import { useState } from "react";
import { Sheet, Button } from "../src";

// 示例组件：内容全部是占位符，实际使用时换成你自己的文案与元素。
// 每个 sheet-detail-row 都必须是弹窗内容层的直接子元素，逐行交错入场靠它生效。
export function SheetExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" size="lg" onClick={() => setIsOpen(true)}>
        按钮
      </Button>

      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="示例弹窗">
        {/* 第 1 行：顶部图标占位 */}
        <div className="sheet-detail-row flex justify-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 mb-5 sm:mb-6">
            <div className="h-6 w-6 rounded-lg bg-[#0071E3]/30" aria-hidden="true" />
          </div>
        </div>

        {/* 第 2 行：标题占位 */}
        <div className="sheet-detail-row flex justify-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-3">
            此处是标题
          </h2>
        </div>

        {/* 第 3 行：正文占位 */}
        <div className="sheet-detail-row flex justify-center">
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-body mb-6 text-center">
            此处是文本
          </p>
        </div>

        {/* 第 4 行：按钮与辅助说明占位 */}
        <div className="sheet-detail-row flex flex-col items-center">
          <Button variant="primary" size="md">
            按下
          </Button>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-body mt-3">
            此处是辅助说明文本
          </p>
        </div>

        <div className="h-6 sm:hidden" />
      </Sheet>
    </>
  );
}
