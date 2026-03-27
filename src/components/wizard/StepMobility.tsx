"use client";

import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";
import { FitnessLevel } from "@/types/plan";
import { Activity, Footprints, Accessibility } from "lucide-react";

const FITNESS_OPTIONS: {
  value: FitnessLevel;
  label: string;
  description: string;
  icon: typeof Activity;
}[] = [
  {
    value: "low",
    label: "轻松休闲",
    description: "喜欢慢节奏，不赶时间",
    icon: Footprints,
  },
  {
    value: "moderate",
    label: "适中平衡",
    description: "既能暴走也能休闲",
    icon: Activity,
  },
  {
    value: "high",
    label: "活力充沛",
    description: "体力充沛，想多看景点",
    icon: Activity,
  },
];

export function StepMobility() {
  const { preferences, updatePreferences } = useWizardStore();

  const fitnessLevel = preferences.mobility?.fitnessLevel || "";
  const walkingTolerance = preferences.mobility?.walkingTolerance || 5;
  const mobilityAid = preferences.mobility?.mobilityAid || false;

  const handleFitnessSelect = (level: FitnessLevel) => {
    updatePreferences({
      mobility: {
        fitnessLevel: level,
        walkingTolerance: preferences.mobility?.walkingTolerance || 5,
        mobilityAid: preferences.mobility?.mobilityAid || false,
      },
    });
  };

  const handleWalkingChange = (value: number) => {
    updatePreferences({
      mobility: {
        fitnessLevel: preferences.mobility?.fitnessLevel || "moderate",
        walkingTolerance: value,
        mobilityAid: preferences.mobility?.mobilityAid || false,
      },
    });
  };

  const handleMobilityAidChange = (checked: boolean) => {
    updatePreferences({
      mobility: {
        fitnessLevel: preferences.mobility?.fitnessLevel || "moderate",
        walkingTolerance: preferences.mobility?.walkingTolerance || 5,
        mobilityAid: checked,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Fitness level */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          体力水平
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {FITNESS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = fitnessLevel === option.value;

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
                onClick={() => handleFitnessSelect(option.value)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors",
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

      {/* Walking tolerance */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          每日步行耐受度
        </h3>
        <div className="bg-surface rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary font-medium">每天步行</span>
            <span className="text-2xl font-bold text-accent">
              {walkingTolerance <= 3
                ? "1-2公里"
                : walkingTolerance <= 6
                ? "3-5公里"
                : walkingTolerance <= 8
                ? "5-8公里"
                : "8公里以上"}
            </span>
          </div>
          <Slider
            value={walkingTolerance}
            onChange={(e) => handleWalkingChange(Number(e.target.value))}
            min={1}
            max={10}
            step={1}
            showValue={false}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>轻松漫步</span>
            <span>暴走模式</span>
          </div>
        </div>
      </div>

      {/* Mobility aid */}
      <div>
        <label className="flex items-center gap-4 p-4 bg-surface rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={mobilityAid}
            onChange={(e) => handleMobilityAidChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <div className="flex items-center gap-3">
            <Accessibility className="w-5 h-5 text-text-muted" />
            <div>
              <span className="font-medium text-primary">需要无障碍设施</span>
              <p className="text-sm text-text-muted">
                需要轮椅通道、电梯等无障碍设施
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Summary */}
      {fitnessLevel && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已选择</p>
              <p className="font-semibold text-primary">
                {FITNESS_OPTIONS.find((f) => f.value === fitnessLevel)?.label} ·{" "}
                {walkingTolerance <= 3
                  ? "1-2公里/天"
                  : walkingTolerance <= 6
                  ? "3-5公里/天"
                  : walkingTolerance <= 8
                  ? "5-8公里/天"
                  : "8公里以上/天"}
                {mobilityAid && " · 需要无障碍设施"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
