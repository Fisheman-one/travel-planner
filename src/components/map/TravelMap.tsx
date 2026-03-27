"use client";

import { useEffect, useRef, useState } from "react";
import { loadAMap, destroyAMap } from "@/lib/map/amap";
import type { DayPlan, Attraction } from "@/types/plan";
import { getDayColor } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface TravelMapProps {
  days: DayPlan[];
  selectedDayIndex?: number | null;
  onMarkerClick?: (attraction: Attraction, dayIndex: number) => void;
  className?: string;
}

export function TravelMap({
  days,
  selectedDayIndex,
  onMarkerClick,
  className = "",
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const initMap = async () => {
      try {
        const map = await loadAMap(containerRef.current!, {
          zoom: 11,
          center: days[0]?.attractions[0]?.coordinates || [121.4737, 31.2304],
        });

        if (!mounted) return;

        mapRef.current = map;
        setIsLoaded(true);

        // Create info window
        if (typeof window !== "undefined") {
          const AMap = (window as any).AMap;
          if (AMap) {
            infoWindowRef.current = new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -30),
            });
          }
        }
      } catch (err) {
        console.error("Failed to initialize map:", err);
        if (mounted) {
          setError("地图加载失败，请检查API配置");
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      destroyAMap();
    };
  }, [days]);

  // Render markers when days or selectedDayIndex changes
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const renderMapElements = async () => {
      const AMap = (window as any).AMap;
      if (!AMap) return;

      // Clear existing markers and polylines
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      markersRef.current = [];
      polylinesRef.current = [];

      const daysToShow =
        selectedDayIndex !== undefined && selectedDayIndex !== null
          ? [days[selectedDayIndex]]
          : days;

      daysToShow.forEach((day, dayIndex) => {
        const actualDayIndex =
          selectedDayIndex !== undefined && selectedDayIndex !== null
            ? selectedDayIndex
            : dayIndex;

        const path: [number, number][] = [];

        day.attractions.forEach((attraction, attrIndex) => {
          // Create marker
          const marker = new AMap.Marker({
            position: new AMap.LngLat(attraction.coordinates[0], attraction.coordinates[1]),
            title: `${actualDayIndex + 1}-${attrIndex + 1} ${attraction.name}`,
            label: {
              content: `<div style="
                background: ${getDayColor(actualDayIndex)};
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
              ">${actualDayIndex + 1}-${attrIndex + 1}</div>`,
              direction: "top",
              offset: new AMap.Pixel(-12, -30),
            },
            extData: { dayIndex: actualDayIndex, attraction },
          });

          // Add click listener
          marker.on("click", () => {
            if (infoWindowRef.current) {
              const content = `
                <div style="padding: 8px; max-width: 280px;">
                  <h4 style="margin: 0 0 8px; font-size: 16px; font-weight: bold; color: #1A1A2E;">
                    ${attraction.name}
                  </h4>
                  <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                    📍 ${attraction.address}
                  </p>
                  <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                    🕐 ${attraction.arrivalTime} - ${attraction.departureTime}
                  </p>
                  <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                    ⏱️ 游览约 ${attraction.duration} 分钟
                  </p>
                  ${attraction.highlights.length > 0 ? `
                    <p style="margin: 8px 0 0; font-size: 12px;">
                      <span style="color: #C9A962;">亮点:</span> ${attraction.highlights.join(", ")}
                    </p>
                  ` : ""}
                </div>
              `;
              infoWindowRef.current.setContent(content);
              infoWindowRef.current.open(mapRef.current, marker.getPosition());
            }
            onMarkerClick?.(attraction, actualDayIndex);
          });

          marker.setMap(mapRef.current);
          markersRef.current.push(marker);
          path.push(attraction.coordinates as [number, number]);
        });

        // Create polyline for the day route
        if (path.length > 1) {
          const polyline = new AMap.Polyline({
            path,
            strokeColor: getDayColor(actualDayIndex),
            strokeWeight: 4,
            strokeOpacity: 0.8,
            showDir: true,
            lineCap: "round",
            lineJoin: "round",
          });
          polyline.setMap(mapRef.current);
          polylinesRef.current.push(polyline);
        }
      });

      // Fit view to show all markers
      if (markersRef.current.length > 0) {
        mapRef.current.setFitView(markersRef.current, false, [50, 50, 50, 50]);
      }
    };

    renderMapElements();
  }, [isLoaded, days, selectedDayIndex, onMarkerClick]);

  if (error) {
    return (
      <Card className={`h-full flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center text-gray-500">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">地图加载中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
