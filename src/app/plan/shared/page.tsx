"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, getDayColor } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Wallet } from "lucide-react";
import Link from "next/link";
import { TravelCardExporter } from "@/components/image/TravelCardExporter";

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

function SharedItineraryContent() {
  const searchParams = useSearchParams();
  const [planData, setPlanData] = useState<SharedPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data");
      if (!dataParam) {
        setError("无效的分享链接");
        return;
      }

      const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
      setPlanData(decoded);
    } catch (e) {
      console.error("Failed to parse share data:", e);
      setError("无法解析分享数据");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-primary mb-4">{error}</h1>
          <p className="text-text-muted mb-6">此分享链接可能已过期或无效</p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">加载中...</p>
        </div>
      </div>
    );
  }

  const totalAttractions = planData.days.reduce((sum, day) => sum + day.a.length, 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">🗺️ 悦途</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card
            variant="elevated"
            padding="lg"
            className="bg-gradient-to-br from-primary to-primary-light overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-3xl">
                  🗺️
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {planData.d} 旅行计划
                  </h1>
                  <p className="text-white/70 mt-1">
                    {planData.days.length} 天精彩行程
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-white/50 text-sm">行程天数</p>
                  <p className="text-2xl font-bold text-white">{planData.days.length}天</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">预计花费</p>
                  <p className="text-2xl font-bold text-accent">{formatCurrency(planData.b)}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">景点数量</p>
                  <p className="text-2xl font-bold text-white">
                    {totalAttractions}个
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Travel Card Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-primary mb-2">
                分享您的旅行计划
              </h2>
              <p className="text-text-muted text-sm">
                生成一张精美的旅行卡片图片，让分享更美好！
              </p>
            </div>
            <div className="flex justify-center">
              <TravelCardExporter planData={planData} />
            </div>
          </Card>
        </motion.div>

        {/* Days */}
        <div className="space-y-6">
          {planData.days.map((day, index) => (
            <motion.div
              key={day.n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="elevated"
                padding="none"
                className="overflow-hidden"
              >
                <div
                  className="px-6 py-4 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${getDayColor(index)} 0%, ${getDayColor(index)}cc 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold">Day {day.n}</span>
                      <span className="text-white/80">{day.t}</span>
                    </div>
                    <span className="text-sm text-white/60">{day.a.length}个景点</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {day.a.map((attrName, attrIndex) => (
                      <div key={attrIndex} className="flex gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: getDayColor(index) }}
                        >
                          {attrIndex + 1}
                        </div>
                        <div className="flex-1 py-2">
                          <h4 className="font-semibold text-primary">{attrName}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 p-8">
            <h3 className="text-xl font-bold text-primary mb-2">
              创建您的专属旅行计划
            </h3>
            <p className="text-text-muted mb-6">
              使用悦途 AI 旅行规划师，为您打造独一无二的行程
            </p>
            <Link href="/plan">
              <Button size="lg">开始规划</Button>
            </Link>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center text-sm text-text-muted">
        <p>由 悦途 Travel Planner 生成</p>
      </footer>
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">加载中...</p>
        </div>
      </div>
    }>
      <SharedItineraryContent />
    </Suspense>
  );
}
