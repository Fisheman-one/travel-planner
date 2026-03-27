import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "悦途 - 您的专属旅行规划师 | Luxury Travel Planner",
  description:
    "基于AI的智能旅行规划平台，为您打造独一无二的专属旅行方案。从行程规划到景点导览，一站式服务让您的每一次旅行都成为难忘的回忆。",
  keywords: "旅行规划, AI旅游, 定制行程, 自由行, 旅游攻略",
  authors: [{ name: "悦途 Travel" }],
  openGraph: {
    title: "悦途 - 您的专属旅行规划师",
    description: "基于AI的智能旅行规划平台",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-surface antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#fff",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
