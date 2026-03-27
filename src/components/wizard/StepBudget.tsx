"use client";

import { useWizardStore } from "@/store/wizardStore";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { BudgetLevel } from "@/types/plan";
import { Wallet, TrendingUp, Crown, Diamond } from "lucide-react";

const BUDGET_OPTIONS: {
  value: BudgetLevel;
  label: string;
  range: string;
  description: string;
  icon: typeof Wallet;
}[] = [
  {
    value: "budget",
    label: "经济实惠",
    range: "¥500-1000/人/天",
    description: "省钱但不委屈，年轻人首选",
    icon: Wallet,
  },
  {
    value: "moderate",
    label: "舒适品质",
    range: "¥1000-2000/人/天",
    description: "性价比之选，体验丰富",
    icon: TrendingUp,
  },
  {
    value: "luxury",
    label: "高端奢华",
    range: "¥2000-5000/人/天",
    description: "享受至上，品质保证",
    icon: Crown,
  },
  {
    value: "ultra-luxury",
    label: "极致尊享",
    range: "¥5000+/人/天",
    description: "不设预算天花板",
    icon: Diamond,
  },
];

export function StepBudget() {
  const { preferences, updatePreferences } = useWizardStore();

  const selectedLevel = preferences.budget?.level || "";

  const handleSelect = (level: BudgetLevel) => {
    updatePreferences({
      budget: {
        level,
        amount: undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">
          选择您的预算级别
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {BUDGET_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedLevel === option.value;

            return (
              <Card
                key={option.value}
                variant={isSelected ? "elevated" : "outlined"}
                padding="lg"
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:-translate-y-1",
                  isSelected &&
                    "ring-2 ring-accent border-accent bg-accent/5"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      isSelected ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-primary">{option.label}</h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-accent font-medium mt-1">
                      {option.range}
                    </p>
                    <p className="text-sm text-text-muted mt-2">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedLevel && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm text-text-muted">已选择</p>
          <p className="font-semibold text-primary">
            {BUDGET_OPTIONS.find((o) => o.value === selectedLevel)?.label}
          </p>
        </div>
      )}
    </div>
  );
}
