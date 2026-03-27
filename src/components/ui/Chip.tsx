"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "md";
}

export function Chip({
  className,
  selected = false,
  variant = "default",
  size = "md",
  children,
  ...props
}: ChipProps) {
  const variants = {
    default: selected
      ? "bg-accent text-white border-accent"
      : "bg-white text-text-primary border-gray-200 hover:border-accent hover:bg-accent/5",
    outline: selected
      ? "bg-transparent text-accent border-2 border-accent"
      : "bg-transparent text-text-primary border-2 border-gray-200 hover:border-accent",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium cursor-pointer transition-all duration-200",
        "border-2",
        variants[variant],
        sizes[size],
        selected && "ring-2 ring-accent/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
