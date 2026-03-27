"use client";

import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { AttractionType } from "@/types/plan";
import { Landmark, TreeDeciduous, Castle, ShoppingBag, Music, UtensilsCrossed, Wine } from "lucide-react";

const ATTRACTION_TYPES: {
  value: AttractionType;
  label: string;
  icon: typeof Landmark;
  description: string;
}[] = [
  {
    value: "museum",
    label: "博物馆/展览",
    icon: Landmark,
    description: "了解历史文化",
  },
  {
    value: "nature",
    label: "自然风光",
    icon: TreeDeciduous,
    description: "山水湖泊美景",
  },
  {
    value: "historical",
    label: "历史古迹",
    icon: Castle,
    description: "古镇、宫殿、寺庙",
  },
  {
    value: "shopping",
    label: "购物",
    icon: ShoppingBag,
    description: "商圈、奥特莱斯",
  },
  {
    value: "entertainment",
    label: "娱乐",
    icon: Music,
    description: "演出、游乐场",
  },
  {
    value: "food",
    label: "美食",
    icon: UtensilsCrossed,
    description: "夜市、美食街",
  },
  {
    value: "nightlife",
    label: "夜生活",
    icon: Wine,
    description: "酒吧、咖啡馆",
  },
];

export function StepAttractions() {
  const { preferences, updatePreferences } = useWizardStore();

  const selectedTypes = preferences.attractions?.types || [];

  const handleTypeToggle = (type: AttractionType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    updatePreferences({
      attractions: {
        types: newTypes,
        mustInclude: preferences.attractions?.mustInclude || [],
        mustExclude: preferences.attractions?.mustExclude || [],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          感兴趣的景点类型（可多选）
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ATTRACTION_TYPES.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedTypes.includes(option.value);

            return (
              <Card
                key={option.value}
                variant={isSelected ? "elevated" : "outlined"}
                padding="md"
                className={cn(
                  "cursor-pointer text-center transition-all duration-200 hover:-translate-y-1",
                  isSelected &&
                    "ring-2 ring-accent border-accent bg-accent/5"
                )}
                onClick={() => handleTypeToggle(option.value)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors",
                    isSelected ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4
                  className={cn(
                    "font-medium mb-1",
                    isSelected ? "text-primary" : "text-text-primary"
                  )}
                >
                  {option.label}
                </h4>
                <p className="text-xs text-text-muted">{option.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {selectedTypes.length > 0 && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已选择</p>
              <p className="font-semibold text-primary">
                {selectedTypes
                  .map((t) => ATTRACTION_TYPES.find((a) => a.value === t)?.label)
                  .join("、")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Icon({ className }: { className?: string }) {
  return null;
}
