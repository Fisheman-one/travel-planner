"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { Plus, X, MessageSquare } from "lucide-react";

const ACCESSIBILITY_OPTIONS = [
  "轮椅通道",
  "电梯优先",
  "休息区充足",
  "婴儿车友好",
  "老人友好",
];

const DIETARY_RESTRICTIONS = [
  "无辣",
  "少盐",
  "少油",
  "无酒精",
  "无海鲜",
  "无坚果",
];

export function StepSpecial() {
  const { preferences, updatePreferences } = useWizardStore();

  const notes = preferences.special?.notes || "";
  const accessibility = preferences.special?.accessibility || [];
  const dietaryRestrictions = preferences.special?.dietaryRestrictions || [];

  const handleNotesChange = (value: string) => {
    updatePreferences({
      special: {
        notes: value,
        accessibility: preferences.special?.accessibility || [],
        dietaryRestrictions: preferences.special?.dietaryRestrictions || [],
      },
    });
  };

  const handleAccessibilityToggle = (item: string) => {
    const newList = accessibility.includes(item)
      ? accessibility.filter((a) => a !== item)
      : [...accessibility, item];

    updatePreferences({
      special: {
        notes: preferences.special?.notes || "",
        accessibility: newList,
        dietaryRestrictions: preferences.special?.dietaryRestrictions || [],
      },
    });
  };

  const handleDietaryToggle = (item: string) => {
    const newList = dietaryRestrictions.includes(item)
      ? dietaryRestrictions.filter((d) => d !== item)
      : [...dietaryRestrictions, item];

    updatePreferences({
      special: {
        notes: preferences.special?.notes || "",
        accessibility: preferences.special?.accessibility || [],
        dietaryRestrictions: newList,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Accessibility needs */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          无障碍需求（可选）
        </h3>
        <div className="flex flex-wrap gap-3">
          {ACCESSIBILITY_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={accessibility.includes(option)}
              onClick={() => handleAccessibilityToggle(option)}
              size="md"
            >
              {option}
            </Chip>
          ))}
        </div>
      </div>

      {/* Dietary restrictions */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          饮食限制（可选）
        </h3>
        <div className="flex flex-wrap gap-3">
          {DIETARY_RESTRICTIONS.map((option) => (
            <Chip
              key={option}
              selected={dietaryRestrictions.includes(option)}
              onClick={() => handleDietaryToggle(option)}
              size="md"
            >
              {option}
            </Chip>
          ))}
        </div>
      </div>

      {/* Special notes */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          其他特殊需求
        </h3>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="告诉我们任何其他需求，比如：带老人小孩、需要拍摄婚纱照、想体验当地文化活动..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Summary */}
      {(accessibility.length > 0 ||
        dietaryRestrictions.length > 0 ||
        notes) && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已填写</p>
              <p className="font-semibold text-primary">
                {accessibility.length > 0 && `${accessibility.join("、")} · `}
                {dietaryRestrictions.length > 0 &&
                  `饮食: ${dietaryRestrictions.join("、")}`}
                {notes && !accessibility.length && !dietaryRestrictions.length && notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info card */}
      <Card variant="outlined" padding="md" className="bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-1">温馨提示</h4>
            <p className="text-sm text-text-muted">
              您的所有偏好都会被认真考虑。我们会根据您的需求，在行程中安排合适的景点顺序、休息时间和餐厅选择。
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
