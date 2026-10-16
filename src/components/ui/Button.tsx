"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";

const VARIANT = {
  primary:
    "bg-[#0071E3] text-white border-transparent hover:bg-[#005BB5] shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10",
  secondary:
    "bg-white/60 dark:bg-white/5 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10",
  ghost:
    "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/5",
} as const;

const SIZE = {
  sm: "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl gap-1 sm:gap-1.5",
  md: "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl gap-1.5 sm:gap-2",
  lg: "px-5 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl gap-2 sm:gap-2.5",
} as const;

// 原站用模板字符串拼类名，这里换成数组 join，结果完全一致
const BASE_CLASS = [
  "inline-flex items-center justify-center font-medium backdrop-blur-md border cursor-pointer",
  "transition-colors duration-200 focus:outline-none focus-visible:ring-2",
  "focus-visible:ring-[#0071E3] focus-visible:ring-offset-2",
].join(" ");

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
}: ButtonProps) {
  const classes = [BASE_CLASS, VARIANT[variant], SIZE[size], className].join(" ");
  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...motionProps}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...motionProps} className={classes}>
      {children}
    </motion.button>
  );
}
