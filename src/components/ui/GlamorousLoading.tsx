"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/Progress";

interface GlamorousLoadingProps {
  city: string;
  progress: number;
  message: string;
  cityImages: string[];
}

// City-specific Unsplash images for loading animation
const CITY_SCENERY: Record<string, string[]> = {
  上海: [
    "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80",
    "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=800&q=80",
    "https://images.unsplash.com/photo-1547619292-8816ee7cdd50?w=800&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
  ],
  北京: [
    "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=80",
    "https://images.unsplash.com/photo-1569744384910-4e1a62c31e04?w=800&q=80",
    "https://images.unsplash.com/photo-1598890777032-a5f6f3eb1508?w=800&q=80",
  ],
  杭州: [
    "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80",
    "https://images.unsplash.com/photo-1593048688881-1b13e32f4e98?w=800&q=80",
    "https://images.unsplash.com/photo-1513836279014-a89f7d76ae86?w=800&q=80",
    "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80",
    "https://images.unsplash.com/photo-1547756434-6f54b8d7a876?w=800&q=80",
  ],
  成都: [
    "https://images.unsplash.com/photo-1618293112488-2c2e8b7d6b5c?w=800&q=80",
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1600093463592-8e36ae1ef3b2?w=800&q=80",
    "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?w=800&q=80",
  ],
  西安: [
    "https://images.unsplash.com/photo-1569761208737-3c4a5c99fb2a?w=800&q=80",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80",
    "https://images.unsplash.com/photo-1596711715226-ac5c2f5a8a77?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  ],
  大理: [
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
  ],
};

export function GlamorousLoading({ city, progress, message, cityImages }: GlamorousLoadingProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  // Get images for the city or use default
  const images = CITY_SCENERY[city] || CITY_SCENERY.default;

  // Auto-rotate images every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setNextImageIndex((prev) => (prev + 1) % images.length);
        setTransitioning(false);
      }, 800);
    }, 1500);

    return () => clearInterval(interval);
  }, [images.length]);

  // Calculate overall progress percentage
  const overallProgress = Math.min(progress, 100);

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Images */}
      <div className="absolute inset-0">
        {/* Current Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: transitioning ? 0 : 1,
            scale: transitioning ? 1.1 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[currentImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        </motion.div>

        {/* Next Image (for transition) */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: transitioning ? 1 : 0,
            scale: transitioning ? 1 : 1.05,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[nextImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [null, `${Math.random() * 100}%`],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🗺️</span>
            <span className="text-4xl font-display font-bold text-white">悦途</span>
          </div>
          <p className="text-white/60 text-lg">正在为您规划专属行程</p>
        </motion.div>

        {/* Image Cards Carousel */}
        <motion.div
          className="relative h-48 mb-12 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main Image Card */}
            <motion.div
              className="relative w-72 h-40 rounded-2xl overflow-hidden shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-lg">{city}</p>
                <p className="text-white/70 text-sm">风景预览</p>
              </div>
            </motion.div>

            {/* Side Cards */}
            <motion.div
              className="absolute -left-8 top-4 w-32 h-24 rounded-xl overflow-hidden shadow-xl opacity-60"
              animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${images[(currentImageIndex + 1) % images.length]})`,
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>

            <motion.div
              className="absolute -right-8 top-8 w-28 h-20 rounded-xl overflow-hidden shadow-xl opacity-50"
              animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${images[(currentImageIndex + 2) % images.length]})`,
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              {/* Progress circle */}
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
                animate={{ strokeDashoffset: 283 - (283 * overallProgress) / 100 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-accent">{Math.round(overallProgress)}%</span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-white text-xl font-medium">{message}</p>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-2 h-2 bg-accent rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 bg-accent/60 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-accent/30 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm">
            精选热门景点 · 优化出行路线 · 打造专属体验
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border border-white/30 rounded-full"
        />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-40 h-40 border border-white/30 rounded-full"
        />
      </div>
    </div>
  );
}
