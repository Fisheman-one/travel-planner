"use client";

import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  label,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-text-primary">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm text-text-muted">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === stepNumber;
        const isPast = stepNumber < currentStep;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300",
                  isCompleted || isPast
                    ? "bg-accent text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-accent/20"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted || isPast ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[80px]",
                  isCurrent ? "text-primary" : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all duration-300",
                  isPast || isCompleted ? "bg-accent" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
