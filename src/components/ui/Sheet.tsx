"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@phosphor-icons/react";
import "./sheet.css";

type SheetProps = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: ReactNode;
};

// 关闭动画 400ms：面板淡出在 280ms 完成，留一点缓冲再卸载
const CLOSE_ANIMATION_MS = 400;

export function Sheet({ isOpen, onClose, ariaLabel, children }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const aliveRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    document.documentElement.style.overflowY = "";
    document.body.style.overflow = "";

    overlay.classList.add("closing");
    overlay.classList.remove("active");
    panel.classList.add("closing");
    panel.classList.remove("active");

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      overlay.classList.remove("closing");
      panel.classList.remove("closing");
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      aliveRef.current = false;
      return;
    }

    aliveRef.current = true;
    document.documentElement.style.overflowY = "scroll";
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel || !aliveRef.current) return;
      void overlay.offsetWidth; // 强制重排，保证 .active 从初始态开始过渡
      overlay.classList.add("active");
      panel.classList.add("active");
    });

    return () => {
      aliveRef.current = false;
      cancelAnimationFrame(raf);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="sheet-root">
      <div
        ref={overlayRef}
        className="sheet-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={handleClose}
      />
      <div ref={panelRef} className="sheet-panel" onClick={(event) => event.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] z-10"
          aria-label="关闭"
        >
          <XIcon size={16} weight="bold" className="text-slate-600 dark:text-slate-400" />
        </button>
        <div
          className="px-6 sm:px-8 pb-8 sm:pb-10 pt-2 flex flex-col justify-center"
          style={{ minHeight: "55vh" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
