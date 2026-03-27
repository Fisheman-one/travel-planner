"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { cn, formatDate } from "@/lib/utils";
import { differenceInDays, addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

const QUICK_DURATIONS = [
  { days: 3, label: "3天2晚", description: "短途周末游" },
  { days: 5, label: "5天4晚", description: "精华深度游" },
  { days: 7, label: "7天6晚", description: "完整旅程" },
  { days: 10, label: "10天9晚", description: "超长假期" },
];

export function StepDates() {
  const { preferences, updatePreferences } = useWizardStore();
  const [startDate, setStartDate] = useState(
    preferences.dates?.startDate || ""
  );
  const [endDate, setEndDate] = useState(preferences.dates?.endDate || "");

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = differenceInDays(end, start) + 1;

      if (days > 0) {
        updatePreferences({
          dates: {
            startDate,
            endDate,
            days,
          },
        });
      }
    }
  }, [startDate, endDate, updatePreferences]);

  const handleQuickSelect = (days: number) => {
    const start = new Date();
    const end = addDays(start, days - 1);

    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    setStartDate(startStr);
    setEndDate(endStr);

    updatePreferences({
      dates: {
        startDate: startStr,
        endDate: endStr,
        days,
      },
    });
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const minDate = today;

  return (
    <div className="space-y-8">
      {/* Quick select */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          快速选择行程天数
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_DURATIONS.map((item) => (
            <Card
              key={item.days}
              variant={
                preferences.dates?.days === item.days ? "elevated" : "outlined"
              }
              padding="md"
              className={cn(
                "cursor-pointer text-center transition-all duration-200 hover:-translate-y-1",
                preferences.dates?.days === item.days &&
                  "ring-2 ring-accent border-accent bg-accent/5"
              )}
              onClick={() => handleQuickSelect(item.days)}
            >
              <div className="text-2xl font-bold text-primary mb-1">
                {item.days}
              </div>
              <div className="text-sm font-medium text-primary">天</div>
              <div className="text-xs text-text-muted mt-2">{item.description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-text-muted">或自定义日期</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Date inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            出发日期
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={minDate}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            返回日期
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || minDate}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Selected dates summary */}
      {preferences.dates?.days && preferences.dates.days > 0 && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">行程时长</p>
              <p className="font-semibold text-primary">
                {preferences.dates.days} 天 {preferences.dates.days - 1} 晚
                {startDate && (
                  <span className="text-text-muted font-normal">
                    {" "}
                    · {formatDate(startDate)}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
