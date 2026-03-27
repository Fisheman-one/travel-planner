import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  return `${hours}:${minutes}`;
}

export function getDayColor(index: number): string {
  const colors = [
    "#C9A962", // Gold
    "#4A90A4", // Blue
    "#7B8B6F", // Green
    "#B85C5C", // Red
    "#8B6BB8", // Purple
    "#C9A962", // Gold
    "#4A90A4", // Blue
  ];
  return colors[index % colors.length];
}

export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
