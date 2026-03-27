"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxBackgroundProps {
  images: string[];
  children: React.ReactNode;
}

export function ParallaxBackground({ images, children }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll();

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms based on scroll - move background slower than foreground
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const backgroundOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 0.4, 0.15]);

  // Handle mouse movement for subtle parallax (3D effect)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Check if component is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  if (images.length === 0) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Parallax Background Layer - Fixed position for true parallax */}
      <motion.div
        className="fixed inset-0 z-0 will-change-transform"
        style={{
          y: backgroundY,
          opacity: backgroundOpacity,
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-surface z-10" />

        {/* Image Grid with Parallax - 3D card effect */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2 p-2">
          {images.slice(0, 8).map((image, index) => {
            // Create varied depth illusion
            const isLarge = index < 2;
            const colSpan = isLarge ? "col-span-2" : "col-span-1";
            const rowSpan = isLarge ? "row-span-2" : "row-span-1";

            // Different parallax speeds create depth illusion
            const depth = (index % 3 + 1) * 0.4;
            const rotateY = mousePosition.x * depth * 3;
            const rotateX = -mousePosition.y * depth * 3;
            const translateX = mousePosition.x * depth * 15;
            const translateY = mousePosition.y * depth * 15;

            return (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl ${colSpan} ${rowSpan}`}
                style={{
                  perspective: "1000px",
                }}
                animate={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  x: translateX,
                  y: translateY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  mass: 0.5
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${image})`,
                    transform: `scale(1.1)`,
                  }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
