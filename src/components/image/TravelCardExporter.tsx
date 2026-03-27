"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { Download, Share2, Check, MapPin, Calendar, Wallet } from "lucide-react";

interface SharedAttraction {
  name: string;
  address?: string;
  arrivalTime?: string;
  departureTime?: string;
  duration?: number;
  type?: string;
}

interface SharedDay {
  n: number; // dayNumber
  t: string; // theme
  a: string[]; // attractions (names only for sharing)
}

interface SharedPlanData {
  d: string; // destination
  days: SharedDay[];
  b: number; // budget
}

interface TravelCardExporterProps {
  planData: SharedPlanData;
}

// City emoji mapping
const CITY_EMOJI: Record<string, string> = {
  上海: "🌆",
  北京: "🏯",
  杭州: "🏙️",
  成都: "🐼",
  西安: "🏛️",
  大理: "🌸",
  洛阳: "🏯",
};

// City illustration colors
const CITY_COLORS: Record<string, { from: string; to: string }> = {
  上海: { from: "#1A1A2E", to: "#16213E" },
  北京: { from: "#8B0000", to: "#4A0E0E" },
  杭州: { from: "#2D5A27", to: "#1A3A15" },
  成都: { from: "#FF6B35", to: "#D4500A" },
  西安: { from: "#8B4513", to: "#5D2E0C" },
  大理: { from: "#4A90A4", to: "#2E5D6B" },
  洛阳: { from: "#9B2335", to: "#6B1525" },
};

export function TravelCardExporter({ planData }: TravelCardExporterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const cityEmoji = CITY_EMOJI[planData.d] || "🗺️";
  const colors = CITY_COLORS[planData.d] || { from: "#1A1A2E", to: "#16213E" };

  const totalAttractions = planData.days.reduce((sum, day) => sum + day.a.length, 0);

  const handleDownloadCard = useCallback(async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    toast.loading("正在生成精美卡片...");

    try {
      // Wait for fonts and images to load
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 400,
        height: 600,
      });

      const link = document.createElement("a");
      link.download = `${planData.d}-旅行卡片-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("卡片已保存！");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("生成失败，请重试");
    } finally {
      setIsExporting(false);
    }
  }, [planData.d]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("链接已复制！");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败");
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Exportable Travel Card */}
      <div className="relative">
        {/* Decorative frame */}
        <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-accent/5 rounded-3xl blur-xl" />

        {/* Main Card */}
        <div
          ref={cardRef}
          className="relative w-[400px] overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
            fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

          {/* Decorative dots pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Card Content */}
          <div className="relative p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{cityEmoji}</div>
                <div>
                  <h1 className="text-xl font-bold">{planData.d}</h1>
                  <p className="text-white/60 text-sm">旅行计划</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent">{planData.days.length}</div>
                <div className="text-white/60 text-xs">天行程</div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-6" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold">{planData.days.length}</div>
                <div className="text-white/50 text-xs">天数</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold">{totalAttractions}</div>
                <div className="text-white/50 text-xs">景点</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold">¥{(planData.b / 10000).toFixed(1)}k</div>
                <div className="text-white/50 text-xs">预算</div>
              </div>
            </div>

            {/* Days Preview - Stylized Route */}
            <div className="space-y-3">
              {planData.days.slice(0, 3).map((day, dayIndex) => (
                <div key={day.n} className="flex items-start gap-3">
                  {/* Day Badge */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `hsl(${200 + dayIndex * 30}, 60%, 50%)`,
                    }}
                  >
                    D{day.n}
                  </div>

                  {/* Day Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{day.t}</div>
                    <div className="text-white/50 text-xs truncate">
                      {day.a.slice(0, 2).join(" · ")}
                      {day.a.length > 2 && ` +${day.a.length - 2}`}
                    </div>
                  </div>

                  {/* Attraction count */}
                  <div className="text-xs text-white/40">{day.a.length}个</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-white/40">悦途 Travel Planner</div>
              <div className="flex items-center gap-1 text-accent text-xs">
                <span>创建专属行程</span>
              </div>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/20 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/20 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/20 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/20 rounded-br" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadCard}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span className="font-medium">下载卡片</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          <span className="font-medium">{copied ? "已复制" : "分享链接"}</span>
        </button>
      </div>

      <p className="text-text-muted text-sm text-center">
        下载精美的旅行卡片图片，分享给朋友们！
      </p>
    </div>
  );
}
