"use client";

import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { FullPlanResult } from "@/types/plan";
import { formatCurrency, getDayColor } from "@/lib/utils";

interface ItineraryExporterProps {
  result: FullPlanResult;
  destination: string;
  className?: string;
}

export function ItineraryExporter({
  result,
  destination,
  className = "",
}: ItineraryExporterProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const generateShareUrl = useCallback(() => {
    // Create a simplified shareable URL with plan data
    const shareData = {
      d: destination,
      days: result.days.map((day) => ({
        n: day.dayNumber,
        t: day.theme,
        a: day.attractions.map((attr) => attr.name),
      })),
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    // Use hash-based routing for client-side sharing
    const shareUrl = `${baseUrl}/plan/shared?data=${encoded}`;
    return shareUrl;
  }, [destination, result]);

  const copyShareUrl = useCallback(async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [generateShareUrl]);

  const downloadAsImage = useCallback(async () => {
    if (!contentRef.current) return false;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#FAFBFC",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${destination}-${result.days.length}天行程.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      return true;
    } catch (error) {
      console.error("Failed to download:", error);
      return false;
    }
  }, [destination, result]);

  return { contentRef, generateShareUrl, copyShareUrl, downloadAsImage };
}

// Standalone component for exporting the itinerary as an image
export function ItineraryImage({
  result,
  destination,
}: ItineraryExporterProps) {
  const totalBudget =
    result.totalBudget ||
    result.days.reduce((sum, day) => sum + (day.dailyBudget || 0), 0);

  return (
    <div
      ref={useRef<HTMLDivElement>(null)}
      className="w-[1080px] max-w-full bg-gradient-to-br from-surface to-white p-12"
      style={{ fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-primary rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{destination} 旅行计划</h1>
              <p className="text-white/70">
                {result.days[0]?.date} - {result.days[result.days.length - 1]?.date}
              </p>
            </div>
          </div>

          <div className="flex gap-8 mt-6">
            <div>
              <p className="text-white/50 text-sm">行程天数</p>
              <p className="text-2xl font-bold text-white">{result.days.length}天</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">预计花费</p>
              <p className="text-2xl font-bold text-accent">{formatCurrency(totalBudget)}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">景点数量</p>
              <p className="text-2xl font-bold text-white">
                {result.days.reduce((sum, day) => sum + day.attractions.length, 0)}个
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-6">
        {result.days.map((day, dayIndex) => (
          <div
            key={day.dayNumber}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Day Header */}
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: getDayColor(dayIndex) }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">Day {day.dayNumber}</span>
                  <span className="text-white/80">{day.theme}</span>
                </div>
                <span className="text-sm text-white/70">{day.date}</span>
              </div>
            </div>

            {/* Attractions */}
            <div className="p-6">
              <div className="space-y-4">
                {day.attractions.map((attr, attrIndex) => (
                  <div key={attr.id} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: getDayColor(dayIndex) }}
                    >
                      {attrIndex + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-primary">{attr.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {attr.address}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-accent">
                          {attr.duration}分钟
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>🕐 {attr.arrivalTime} - {attr.departureTime}</span>
                        <span>📍 {attr.transportation.to}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meals */}
              {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    {day.meals.breakfast && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">早餐</p>
                        <p className="font-medium text-primary">{day.meals.breakfast.name}</p>
                      </div>
                    )}
                    {day.meals.lunch && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">午餐</p>
                        <p className="font-medium text-primary">{day.meals.lunch.name}</p>
                      </div>
                    )}
                    {day.meals.dinner && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">晚餐</p>
                        <p className="font-medium text-primary">{day.meals.dinner.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>由 悦途 Travel Planner 生成</p>
      </div>
    </div>
  );
}
