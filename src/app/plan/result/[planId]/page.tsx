"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/store/planStore";
import { useWizardStore } from "@/store/wizardStore";
import { generateMockPlan } from "@/data/mock-itineraries";
import { FullPlanResult, DayPlan } from "@/types/plan";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Chip";
import { Progress } from "@/components/ui/Progress";
import { ArrowLeft, Map, List, Download, Share2, Loader2 } from "lucide-react";
import { formatCurrency, getDayColor } from "@/lib/utils";
import { TravelMap } from "@/components/map/TravelMap";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { preferences, resetWizard } = useWizardStore();
  const {
    plan,
    status,
    progress,
    setSelectedDay,
    selectedDayIndex,
    resetPlan,
  } = usePlanStore();

  const [activeTab, setActiveTab] = useState<"map" | "itinerary">("itinerary");
  const [result, setResult] = useState<FullPlanResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [progressMessage, setProgressMessage] = useState("正在分析您的偏好...");

  useEffect(() => {
    // Simulate generation process
    const steps = [
      { progress: 15, message: "正在分析您的偏好..." },
      { progress: 30, message: "正在搜索热门景点..." },
      { progress: 50, message: "正在规划每日行程..." },
      { progress: 70, message: "正在计算最优路线..." },
      { progress: 85, message: "正在筛选特色餐厅..." },
      { progress: 95, message: "正在生成最终方案..." },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgressMessage(steps[currentStep].message);
        currentStep++;
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      const mockResult = generateMockPlan(preferences);
      setResult(mockResult);
      setIsGenerating(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [preferences]);

  const handleNewPlan = () => {
    resetPlan();
    resetWizard();
    router.push("/plan");
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: "我的旅行计划",
          text: `${preferences.destination?.city} · ${result.days.length}天行程`,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-8"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="6"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#C9A962"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                transform="rotate(-90 50 50)"
              />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-display font-bold text-primary mb-3">
            正在为您规划专属行程
          </h2>
          <p className="text-text-muted mb-8">{progressMessage}</p>

          <div className="space-y-4">
            <Progress value={(progressMessage.length / 100) * 100} size="md" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            生成失败
          </h2>
          <p className="text-text-muted mb-6">请稍后重试</p>
          <Button onClick={handleNewPlan}>重新规划</Button>
        </div>
      </div>
    );
  }

  const totalBudget =
    result.totalBudget ||
    result.days.reduce((sum, day) => sum + (day.dailyBudget || 0), 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleNewPlan}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">重新规划</span>
            </button>
            <h1 className="text-lg font-semibold text-primary">
              {preferences.destination?.city} · {result.days.length}天行程
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Card */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Card variant="elevated" padding="md" className="bg-gradient-to-r from-primary to-primary-light">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
              <div>
                <p className="text-white/70 text-sm">行程天数</p>
                <p className="text-2xl font-bold mt-1">{result.days.length}天</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">预计花费</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalBudget)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">景点数量</p>
                <p className="text-2xl font-bold mt-1">
                  {result.days.reduce((sum, day) => sum + day.attractions.length, 0)}个
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">旅行风格</p>
                <p className="text-2xl font-bold mt-1">
                  {preferences.budget?.level === "budget"
                    ? "经济"
                    : preferences.budget?.level === "moderate"
                    ? "舒适"
                    : preferences.budget?.level === "luxury"
                    ? "高端"
                    : "奢华"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === "itinerary"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-primary"
              }`}
            >
              <List className="w-5 h-5" />
              行程详情
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === "map"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-primary"
              }`}
            >
              <Map className="w-5 h-5" />
              地图视图
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "itinerary" ? (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {result.days.map((day, index) => (
                <DayCard
                  key={day.dayNumber}
                  day={day}
                  isSelected={selectedDayIndex === index}
                  onSelect={() => setSelectedDay(index)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card variant="elevated" padding="none" className="h-[600px] overflow-hidden">
                <TravelMap
                  days={result.days}
                  selectedDayIndex={selectedDayIndex}
                  className="h-full"
                />
              </Card>
              {/* Day selector below map */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {result.days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDayIndex === i
                        ? "text-white"
                        : "bg-white text-text-primary hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor:
                        selectedDayIndex === i ? getDayColor(i) : undefined,
                    }}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDay(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDayIndex === null
                      ? "bg-primary text-white"
                      : "bg-white text-text-primary hover:bg-gray-50"
                  }`}
                >
                  显示全部
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlights */}
        {result.highlights && result.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-display font-bold text-primary mb-4">
              行程亮点
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {result.highlights.map((highlight, i) => (
                <Card key={i} variant="outlined" padding="md">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: getDayColor(i) }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-text-primary">{highlight}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tips */}
        {result.tips && result.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-xl font-display font-bold text-primary mb-4">
              温馨提示
            </h2>
            <Card variant="outlined" padding="md" className="bg-amber-50 border-amber-200">
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm text-text-muted">
            行程已生成，共{" "}
            <span className="font-semibold text-primary">{result.days.length}</span>{" "}
            天，包含{" "}
            <span className="font-semibold text-primary">
              {result.days.reduce((sum, day) => sum + day.attractions.length, 0)}
            </span>{" "}
            个景点
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md">
              <Download className="w-4 h-4 mr-2" />
              下载行程
            </Button>
            <Button size="md">
              <Share2 className="w-4 h-4 mr-2" />
              分享行程
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DayCardProps {
  day: DayPlan;
  isSelected: boolean;
  onSelect: () => void;
}

function DayCard({ day, isSelected, onSelect }: DayCardProps) {
  const totalDuration = day.attractions.reduce(
    (sum, attr) => sum + attr.duration,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant={isSelected ? "elevated" : "default"}
        padding="none"
        className={`overflow-hidden cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-accent" : ""
        }`}
        onClick={onSelect}
      >
        {/* Header */}
        <div
          className="px-6 py-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${getDayColor(day.dayNumber - 1)} 0%, ${getDayColor(day.dayNumber - 1)}cc 100%)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm opacity-80">Day</span>
              <span className="text-2xl font-bold ml-2">{day.dayNumber}</span>
            </div>
            <Badge variant="default" className="bg-white/20 text-white border-0">
              {day.theme}
            </Badge>
          </div>
          <p className="text-sm opacity-80 mt-1">{day.date}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Attractions Timeline */}
          <div className="space-y-4">
            {day.attractions.map((attr, index) => (
              <div key={attr.id} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm"
                  >
                    {index + 1}
                  </div>
                  {index < day.attractions.length - 1 && (
                    <div className="w-0.5 h-full min-h-[60px] bg-gray-200 my-1" />
                  )}
                </div>

                {/* Attraction info */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-primary">{attr.name}</h4>
                      <p className="text-sm text-text-muted mt-0.5">
                        {attr.address}
                      </p>
                    </div>
                    <Badge variant="default" className="bg-gray-100 text-text-muted">
                      {attr.duration}分钟
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                    <span>🕐 {attr.arrivalTime} - {attr.departureTime}</span>
                    <span>📍 {attr.transportation.to}</span>
                  </div>

                  {attr.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attr.highlights.slice(0, 2).map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Meals */}
          {day.meals && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h5 className="text-sm font-medium text-text-muted mb-3">用餐安排</h5>
              <div className="grid grid-cols-3 gap-4">
                {day.meals.breakfast && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-text-muted">早餐</p>
                    <p className="font-medium text-primary text-sm">
                      {day.meals.breakfast.name}
                    </p>
                  </div>
                )}
                {day.meals.lunch && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-text-muted">午餐</p>
                    <p className="font-medium text-primary text-sm">
                      {day.meals.lunch.name}
                    </p>
                  </div>
                )}
                {day.meals.dinner && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-text-muted">晚餐</p>
                    <p className="font-medium text-primary text-sm">
                      {day.meals.dinner.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {day.accommodation && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h5 className="text-sm font-medium text-text-muted mb-3">住宿推荐</h5>
              <div className="p-4 bg-accent/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">
                      {day.accommodation.name}
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      {day.accommodation.reason}
                    </p>
                  </div>
                  {day.accommodation.price && (
                    <span className="text-accent font-bold">
                      ¥{day.accommodation.price}/晚
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Daily Budget */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-text-muted">当日预算</span>
            <span className="text-lg font-bold text-accent">
              {formatCurrency(day.dailyBudget)}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
