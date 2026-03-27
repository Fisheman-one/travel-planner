"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { usePlanStore } from "@/store/planStore";
import { useWizardStore } from "@/store/wizardStore";
import { FullPlanResult, DayPlan, ActivityBudget } from "@/types/plan";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Chip";
import { Progress } from "@/components/ui/Progress";
import { ArrowLeft, Map, List, Download, Share2, Loader2, Check, ChevronDown, ChevronUp, Wallet } from "lucide-react";
import { formatCurrency, getDayColor } from "@/lib/utils";
import { TravelMap } from "@/components/map/TravelMap";
import { toast } from "sonner";
import { GlamorousLoading } from "@/components/ui/GlamorousLoading";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { FloatingTipsCard } from "@/components/ui/FloatingTipsCard";
import { itineraryEngine } from "@/lib/itinerary-engine";

// City images for parallax background
const CITY_IMAGES: Record<string, string[]> = {
  上海: [
    "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=400&q=60",
    "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=400&q=60",
    "https://images.unsplash.com/photo-1547619292-8816ee7cdd50?w=400&q=60",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=60",
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=60",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=400&q=60",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60",
  ],
  北京: [
    "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=60",
    "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&q=60",
    "https://images.unsplash.com/photo-1569744384910-4e1a62c31e04?w=400&q=60",
    "https://images.unsplash.com/photo-1598890777032-a5f6f3eb1508?w=400&q=60",
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=60",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=400&q=60",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60",
  ],
  杭州: [
    "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=400&q=60",
    "https://images.unsplash.com/photo-1593048688881-1b13e32f4e98?w=400&q=60",
    "https://images.unsplash.com/photo-1547756434-6f54b8d7a876?w=400&q=60",
    "https://images.unsplash.com/photo-1598890777032-a5f6f3eb1508?w=400&q=60",
    "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=400&q=60",
    "https://images.unsplash.com/photo-1593048688881-1b13e32f4e98?w=400&q=60",
    "https://images.unsplash.com/photo-1547756434-6f54b8d7a876?w=400&q=60",
    "https://images.unsplash.com/photo-1598890777032-a5f6f3eb1508?w=400&q=60",
  ],
  成都: [
    "https://images.unsplash.com/photo-1618293112488-2c2e8b7d6b5c?w=400&q=60",
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=60",
    "https://images.unsplash.com/photo-1600093463592-8e36ae1ef3b2?w=400&q=60",
    "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?w=400&q=60",
    "https://images.unsplash.com/photo-1618293112488-2c2e8b7d6b5c?w=400&q=60",
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=60",
    "https://images.unsplash.com/photo-1600093463592-8e36ae1ef3b2?w=400&q=60",
    "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?w=400&q=60",
  ],
  西安: [
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=60",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=400&q=60",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60",
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=60",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=400&q=60",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60",
  ],
  大理: [
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=60",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=60",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=60",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=60",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=60",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=60",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=60",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=60",
  ],
  洛阳: [
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1598928508506-4d1e6a1a0a0a?w=400&q=60",
    "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&q=60",
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=400&q=60",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=400&q=60",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=60",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60",
  ],
  default: [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=60",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=60",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=60",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=60",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=60",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=60",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=60",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=60",
  ],
};

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
      // 使用真实计算引擎生成行程
      const realResult = itineraryEngine.generateItinerary(preferences);
      setResult(realResult);
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
    if (result && preferences.destination?.city) {
      // Create shareable data
      const shareData = {
        d: preferences.destination.city,
        days: result.days.map((day) => ({
          n: day.dayNumber,
          t: day.theme,
          a: day.attractions.slice(0, 3).map((attr) => attr.name), // Limit to first 3 attractions
        })),
        b: result.days.reduce((sum, day) => sum + (day.dailyBudget || 0), 0),
      };

      const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
      const shareUrl = `${window.location.origin}/plan/shared?data=${encoded}`;

      // Try native share first (mobile)
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${preferences.destination.city}旅行计划`,
            text: `查看我在${preferences.destination.city}的${result.days.length}天旅行计划！`,
            url: shareUrl,
          });
          return;
        } catch (err) {
          // User cancelled or not supported, fall back to clipboard
        }
      }

      // Fall back to copying URL
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("分享链接已复制到剪贴板！");
      } catch {
        toast.error("分享失败，请重试");
      }
    }
  };

  const handleDownload = async () => {
    const itineraryEl = document.getElementById("itinerary-export");
    if (!itineraryEl) {
      toast.error("下载失败，请重试");
      return;
    }

    try {
      toast.loading("正在生成图片...");

      const canvas = await html2canvas(itineraryEl, {
        backgroundColor: "#FAFBFC",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200,
        windowHeight: itineraryEl.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `${preferences.destination?.city || "旅行"}-${result?.days.length || 0}天行程.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("图片下载成功！");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("下载失败，请重试");
    }
  };

  if (isGenerating) {
    // Calculate progress based on the index of current message in steps
    const progressMessages = [
      "正在分析您的偏好...",
      "正在搜索热门景点...",
      "正在规划每日行程...",
      "正在计算最优路线...",
      "正在筛选特色餐厅...",
      "正在生成最终方案...",
    ];
    const messageIndex = progressMessages.indexOf(progressMessage);
    const progressPercent = messageIndex >= 0 ? 15 + messageIndex * 15 : 15;

    return (
      <GlamorousLoading
        city={preferences.destination?.city || "上海"}
        progress={progressPercent}
        message={progressMessage}
        cityImages={CITY_IMAGES[preferences.destination?.city || "default"] || CITY_IMAGES.default}
      />
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
    result.budgetBreakdown?.total ||
    result.totalBudget ||
    result.days.reduce((sum, day) => sum + (day.dailyBudget || 0), 0);

  const perPersonBudget = result.budgetBreakdown?.perPersonTotal || totalBudget;
  const companionsCount = preferences.companions?.count || 1;

  const cityImages = CITY_IMAGES[preferences.destination?.city || "default"] || CITY_IMAGES.default;

  return (
    <ParallaxBackground images={cityImages}>
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
              <Button variant="ghost" size="sm" onClick={handleDownload}>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-white">
              <div>
                <p className="text-white/70 text-sm">行程天数</p>
                <p className="text-2xl font-bold mt-1">{result.days.length}天</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">总预算</p>
                <p className="text-2xl font-bold mt-1 text-accent">{formatCurrency(totalBudget)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">人均</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(perPersonBudget)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">景点数量</p>
                <p className="text-2xl font-bold mt-1">
                  {result.days.reduce((sum, day) => sum + day.attractions.length, 0)}个
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">旅行风格</p>
                <p className="text-xl font-bold mt-1">
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
            {/* Budget Breakdown Mini Bar */}
            {result.budgetBreakdown && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                  <Wallet className="w-4 h-4" />
                  <span>预算构成</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-white/20">
                  {result.budgetBreakdown.attractionsTotal > 0 && (
                    <div
                      className="bg-green-400"
                      style={{ width: `${(result.budgetBreakdown.attractionsTotal / totalBudget) * 100}%` }}
                      title="景点门票"
                    />
                  )}
                  {result.budgetBreakdown.mealsTotal > 0 && (
                    <div
                      className="bg-orange-400"
                      style={{ width: `${(result.budgetBreakdown.mealsTotal / totalBudget) * 100}%` }}
                      title="餐饮"
                    />
                  )}
                  {result.budgetBreakdown.transportTotal > 0 && (
                    <div
                      className="bg-blue-400"
                      style={{ width: `${(result.budgetBreakdown.transportTotal / totalBudget) * 100}%` }}
                      title="交通"
                    />
                  )}
                  {result.budgetBreakdown.accommodationTotal > 0 && (
                    <div
                      className="bg-purple-400"
                      style={{ width: `${(result.budgetBreakdown.accommodationTotal / totalBudget) * 100}%` }}
                      title="住宿"
                    />
                  )}
                  {result.budgetBreakdown.miscTotal > 0 && (
                    <div
                      className="bg-gray-400"
                      style={{ width: `${(result.budgetBreakdown.miscTotal / totalBudget) * 100}%` }}
                      title="杂费"
                    />
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-white/60">
                  <span>🎫 门票 {formatCurrency(result.budgetBreakdown.attractionsTotal)}</span>
                  <span>🍜 餐饮 {formatCurrency(result.budgetBreakdown.mealsTotal)}</span>
                  <span>🚌 交通 {formatCurrency(result.budgetBreakdown.transportTotal)}</span>
                  <span>🏨 住宿 {formatCurrency(result.budgetBreakdown.accommodationTotal)}</span>
                </div>
              </div>
            )}
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
      <main id="itinerary-export" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-32">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
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
            <Button variant="outline" size="md" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              下载行程
            </Button>
            <Button size="md" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              分享行程
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Tips Card with Weather */}
      <FloatingTipsCard city={preferences.destination?.city || "上海"} />
    </div>
    </ParallaxBackground>
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

  // Extract budget info from budgetBreakdown if available
  const getAttractionBudget = (name: string) => {
    return day.budgetBreakdown?.find(b => b.category === "attraction" && b.name === name);
  };

  const getMealBudget = (mealType: "breakfast" | "lunch" | "dinner") => {
    const prefix = mealType === "breakfast" ? "早餐" : mealType === "lunch" ? "午餐" : "晚餐";
    return day.budgetBreakdown?.find(b => b.category === "meal" && b.name.startsWith(prefix));
  };

  const getTransportBudget = () => {
    return day.budgetBreakdown?.find(b => b.category === "transport");
  };

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
                    <div className="text-right">
                      <Badge variant="default" className="bg-gray-100 text-text-muted">
                        {attr.duration}分钟
                      </Badge>
                      {getAttractionBudget(attr.name) && (
                        <p className="text-xs text-accent font-medium mt-1">
                          ¥{getAttractionBudget(attr.name)?.subtotal}
                        </p>
                      )}
                    </div>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-text-muted">早餐</p>
                        <p className="font-medium text-primary text-sm">
                          {day.meals.breakfast.name}
                        </p>
                      </div>
                      {getMealBudget("breakfast") && (
                        <span className="text-xs text-accent font-medium">
                          ¥{getMealBudget("breakfast")?.subtotal}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {day.meals.lunch && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-text-muted">午餐</p>
                        <p className="font-medium text-primary text-sm">
                          {day.meals.lunch.name}
                        </p>
                      </div>
                      {getMealBudget("lunch") && (
                        <span className="text-xs text-accent font-medium">
                          ¥{getMealBudget("lunch")?.subtotal}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {day.meals.dinner && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-text-muted">晚餐</p>
                        <p className="font-medium text-primary text-sm">
                          {day.meals.dinner.name}
                        </p>
                      </div>
                      {getMealBudget("dinner") && (
                        <span className="text-xs text-accent font-medium">
                          ¥{getMealBudget("dinner")?.subtotal}
                        </span>
                      )}
                    </div>
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
                    <div className="text-right">
                      <span className="text-accent font-bold">
                        ¥{day.accommodation.price}/晚
                      </span>
                      <p className="text-xs text-text-muted">
                        (人均约 ¥{Math.ceil(day.accommodation.price / 2)}/晚)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Daily Budget */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">当日预算</span>
              <span className="text-lg font-bold text-accent">
                {formatCurrency(day.dailyBudget)}
              </span>
            </div>
            {day.budgetBreakdown && day.budgetBreakdown.length > 0 && (
              <div className="text-xs text-text-muted space-y-1">
                {day.budgetBreakdown.filter(b => b.category === "attraction").length > 0 && (
                  <p>🎫 门票: ¥{day.budgetBreakdown.filter(b => b.category === "attraction").reduce((s, b) => s + b.subtotal, 0)}</p>
                )}
                {day.budgetBreakdown.filter(b => b.category === "meal").length > 0 && (
                  <p>🍜 餐饮: ¥{day.budgetBreakdown.filter(b => b.category === "meal").reduce((s, b) => s + b.subtotal, 0)}</p>
                )}
                {day.budgetBreakdown.filter(b => b.category === "transport").length > 0 && (
                  <p>🚌 交通: ¥{day.budgetBreakdown.filter(b => b.category === "transport").reduce((s, b) => s + b.subtotal, 0)}</p>
                )}
                {day.budgetBreakdown.filter(b => b.category === "accommodation").length > 0 && (
                  <p>🏨 住宿: ¥{day.budgetBreakdown.filter(b => b.category === "accommodation").reduce((s, b) => s + b.subtotal, 0)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
