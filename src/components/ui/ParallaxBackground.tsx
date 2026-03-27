"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxBackgroundProps {
  images: string[];
  children: React.ReactNode;
}

export function ParallaxBackground({ images, children }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax transforms based on scroll
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300, 500], [0.6, 0.3, 0.1]);

  // Handle mouse movement for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (images.length === 0) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Parallax Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface z-10" />

        {/* Image Grid with Parallax */}
        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
          {images.slice(0, 8).map((image, index) => {
            const isLarge = index < 2;
            const colSpan = isLarge ? "col-span-2" : "col-span-1";
            const rowSpan = isLarge ? "row-span-2" : "row-span-1";

            // Different parallax speeds for different positions
            const depth = (index % 3 + 1) * 0.3;
            const offsetX = (mousePosition.x * depth * 20);
            const offsetY = (mousePosition.y * depth * 20);

            return (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-lg ${colSpan} ${rowSpan}`}
                animate={{
                  x: offsetX,
                  y: offsetY,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image})`,
                    transform: `scale(${1 + depth * 0.1})`,
                  }}
                />
                <div className="absolute inset-0 bg-primary/30 hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            );
          })}
        </div>

        {/* Blur Overlay for depth effect */}
        <div className="absolute inset-0 backdrop-blur-sm z-[5]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
