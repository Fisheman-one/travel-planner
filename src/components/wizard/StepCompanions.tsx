"use client";

import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";
import { Relationship, AgeRange } from "@/types/plan";
import { Users, Heart, User, Home, Group } from "lucide-react";

const RELATIONSHIP_OPTIONS: {
  value: Relationship;
  label: string;
  icon: typeof Users;
}[] = [
  { value: "solo", label: "独自旅行", icon: User },
  { value: "couple", label: "情侣/夫妻", icon: Heart },
  { value: "friends", label: "朋友同行", icon: Users },
  { value: "family", label: "家庭出游", icon: Home },
];

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "20-25", label: "20-25岁" },
  { value: "26-30", label: "26-30岁" },
  { value: "31-35", label: "31-35岁" },
  { value: "36-45", label: "36-45岁" },
  { value: "45+", label: "45岁以上" },
];

export function StepCompanions() {
  const { preferences, updatePreferences } = useWizardStore();

  const selectedRelationship = preferences.companions?.relationship || "";
  const selectedAge = preferences.companions?.ageRange || "";
  const count = preferences.companions?.count || 1;

  const handleRelationshipSelect = (relationship: Relationship) => {
    updatePreferences({
      companions: {
        relationship,
        count: preferences.companions?.count || 1,
        ageRange: preferences.companions?.ageRange || "26-30",
      },
    });
  };

  const handleAgeSelect = (ageRange: AgeRange) => {
    updatePreferences({
      companions: {
        relationship: preferences.companions?.relationship || "solo",
        count: preferences.companions?.count || 1,
        ageRange,
      },
    });
  };

  const handleCountChange = (newCount: number) => {
    updatePreferences({
      companions: {
        relationship: preferences.companions?.relationship || "solo",
        count: newCount,
        ageRange: preferences.companions?.ageRange || "26-30",
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Relationship */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          旅行类型
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RELATIONSHIP_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRelationship === option.value;

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
                onClick={() => handleRelationshipSelect(option.value)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors",
                    isSelected ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-text-muted"
                  )}
                >
                  {option.label}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Count */}
      {selectedRelationship && selectedRelationship !== "solo" && (
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-4">
            同行人数
          </h3>
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary font-medium">人数</span>
              <span className="text-2xl font-bold text-accent">{count}人</span>
            </div>
            <Slider
              value={count}
              onChange={(e) => handleCountChange(Number(e.target.value))}
              min={2}
              max={10}
              step={1}
              showValue={false}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>2人</span>
              <span>10人+</span>
            </div>
          </div>
        </div>
      )}

      {/* Age range */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          年龄段
        </h3>
        <div className="flex flex-wrap gap-3">
          {AGE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={selectedAge === option.value}
              onClick={() => handleAgeSelect(option.value)}
              size="md"
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Summary */}
      {selectedRelationship && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Group className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已选择</p>
              <p className="font-semibold text-primary">
                {RELATIONSHIP_OPTIONS.find((r) => r.value === selectedRelationship)
                  ?.label || "独自旅行"}
                {selectedRelationship !== "solo" && ` · ${count}人`}
                {selectedAge && ` · ${selectedAge}岁`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
