"use client";

import { motion } from "framer-motion";
import { Compass, MapPin, Sparkles } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <Compass className="w-full h-full text-accent" />
        </motion.div>

        <h1 className="text-2xl font-display font-bold text-primary mb-4">
          正在为您规划专属行程
        </h1>
        <p className="text-text-muted mb-8">
          AI 正在分析您的偏好，请稍候...
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-accent rounded-full"
            />
          ))}
        </div>

        <div className="space-y-3 text-left max-w-sm mx-auto">
          {[
            { icon: MapPin, text: "分析目的地信息" },
            { icon: Sparkles, text: "筛选热门景点" },
            { icon: MapPin, text: "规划最优路线" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
            >
              <item.icon className="w-5 h-5 text-accent" />
              <span className="text-sm text-text-primary">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
