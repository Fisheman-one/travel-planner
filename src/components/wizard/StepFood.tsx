"use client";

import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { FoodPreference, FoodBudget } from "@/types/plan";
import { Utensils, Coffee, Pizza, Salad, Heart, Star } from "lucide-react";

const FOOD_PREFERENCES: {
  value: FoodPreference;
  label: string;
  icon: typeof Coffee;
}[] = [
  { value: "local", label: "当地美食", icon: Utensils },
  { value: "western", label: "西餐", icon: Pizza },
  { value: "vegetarian", label: "素食", icon: Salad },
  { value: "japanese", label: "日料", icon: Utensils },
  { value: "korean", label: "韩餐", icon: Utensils },
  { value: "halal", label: "清真", icon: Heart },
];

const FOOD_BUDGET_OPTIONS: { value: FoodBudget; label: string; description: string }[] = [
  { value: "economy", label: "经济实惠", description: "路边摊、小吃为主" },
  { value: "moderate", label: "适中平衡", description: "特色餐厅+小吃" },
  { value: "fine-dining", label: "精致餐饮", description: "米其林、高端餐厅" },
];

export function StepFood() {
  const { preferences, updatePreferences } = useWizardStore();

  const selectedPreferences = preferences.food?.preferences || [];
  const selectedBudget = preferences.food?.budget || "";
  const mustTry = preferences.food?.mustTry || [];

  const handlePreferenceToggle = (pref: FoodPreference) => {
    const newPrefs = selectedPreferences.includes(pref)
      ? selectedPreferences.filter((p) => p !== pref)
      : [...selectedPreferences, pref];

    updatePreferences({
      food: {
        preferences: newPrefs,
        budget: preferences.food?.budget || "moderate",
        mustTry: preferences.food?.mustTry || [],
      },
    });
  };

  const handleBudgetSelect = (budget: FoodBudget) => {
    updatePreferences({
      food: {
        preferences: preferences.food?.preferences || [],
        budget,
        mustTry: preferences.food?.mustTry || [],
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Food preferences */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          餐饮偏好（可多选）
        </h3>
        <div className="flex flex-wrap gap-3">
          {FOOD_PREFERENCES.map((option) => {
            const isSelected = selectedPreferences.includes(option.value);
            return (
              <Chip
                key={option.value}
                selected={isSelected}
                onClick={() => handlePreferenceToggle(option.value)}
                size="md"
              >
                <option.icon className="w-4 h-4 mr-2" />
                {option.label}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Food budget */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          餐饮预算
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {FOOD_BUDGET_OPTIONS.map((option) => {
            const isSelected = selectedBudget === option.value;

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
                onClick={() => handleBudgetSelect(option.value)}
              >
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
      {selectedPreferences.length > 0 && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已选择</p>
              <p className="font-semibold text-primary">
                {selectedPreferences
                  .map((p) => FOOD_PREFERENCES.find((f) => f.value === p)?.label)
                  .join("、")}
                {selectedBudget && ` · ${selectedBudget}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
