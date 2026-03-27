"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cloud, Sun, CloudRain, CloudSnow, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface FloatingTipsCardProps {
  city: string;
  destination?: string;
}

interface Weather {
  temp: number;
  condition: string;
  icon: string;
}

// Mock weather data based on city
const WEATHER_DATA: Record<string, Weather> = {
  上海: { temp: 22, condition: "多云", icon: "cloud" },
  北京: { temp: 18, condition: "晴", icon: "sun" },
  杭州: { temp: 24, condition: "小雨", icon: "rain" },
  成都: { temp: 20, condition: "阴", icon: "cloud" },
  西安: { temp: 19, condition: "晴", icon: "sun" },
  大理: { temp: 21, condition: "晴", icon: "sun" },
};

const DEFAULT_WEATHER: Weather = { temp: 22, condition: "多云", icon: "cloud" };

const WEATHER_TIPS: Record<string, string[]> = {
  上海: [
    "外滩夜景建议傍晚时分前往，可欣赏日夜交替美景",
    "热门景点建议提前在线购票",
  ],
  北京: [
    "北京景点门票建议提前在线购买",
    "5月份天气较好，但紫外线强，注意防晒",
  ],
  杭州: [
    "西湖周边节假日人多，建议平日前往",
    "龙井茶价格差异大，建议在茶农家直接购买",
  ],
  成都: [
    "成都美食偏辣，如有特殊口味可提前告知",
    "大熊猫基地建议早上前往，熊猫比较活跃",
  ],
  西安: [
    "兵马俑建议租用导览器或跟随导游",
    "回民街美食较多，注意清真餐厅标识",
  ],
  大理: [
    "大理紫外线较强，记得带防晒霜",
    "环洱海骑行建议租电动车，注意安全",
  ],
  default: [
    "热门景点建议提前在线购票，避免排队",
    "注意天气变化，适时增减衣物",
  ],
};

const ICON_MAP: Record<string, React.ReactNode> = {
  sun: <Sun className="w-5 h-5 text-amber-500" />,
  cloud: <Cloud className="w-5 h-5 text-gray-500" />,
  rain: <CloudRain className="w-5 h-5 text-blue-500" />,
  snow: <CloudSnow className="w-5 h-5 text-blue-300" />,
};

export function FloatingTipsCard({ city, destination }: FloatingTipsCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [weather, setWeather] = useState<Weather>(DEFAULT_WEATHER);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    // Get weather for the city
    const cityWeather = WEATHER_DATA[city] || WEATHER_DATA[destination as string] || DEFAULT_WEATHER;
    setWeather(cityWeather);

    // Get tips for the city
    const cityTips = WEATHER_TIPS[city] || WEATHER_TIPS[destination as string] || WEATHER_TIPS.default;
    setTips(cityTips);
  }, [city, destination]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-24 left-4 z-40 max-w-sm"
      >
        <Card
          variant="elevated"
          padding="md"
          className="bg-white/95 backdrop-blur-md shadow-xl border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-full">
                {ICON_MAP[weather.icon] || ICON_MAP.cloud}
                <span className="text-sm font-semibold text-primary">{weather.temp}°C</span>
              </div>
              <div className="flex items-center gap-1 text-text-muted">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">{city}</span>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Weather Description */}
          <p className="text-xs text-text-muted mb-3">{weather.condition} · 适宜出行</p>

          {/* Expandable Tips */}
          <div className="space-y-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-primary">旅行提示</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-text-muted">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsed Preview */}
          {!isExpanded && (
            <p className="text-xs text-text-muted line-clamp-1">{tips[0]}</p>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
