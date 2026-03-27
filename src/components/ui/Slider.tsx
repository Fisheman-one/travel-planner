"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      error,
      min = 0,
      max = 100,
      step = 1,
      showValue = true,
      formatValue,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const sliderId = id || label?.toLowerCase().replace(/\s/g, "-");
    const currentValue = Number(value);

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label
              htmlFor={sliderId}
              className="block text-sm font-medium text-text-primary"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-accent">
              {formatValue ? formatValue(currentValue) : currentValue}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-gray-200",
              "focus:outline-none focus:ring-2 focus:ring-accent/20",
              className
            )}
            {...props}
          />
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c9a962;
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              transition: transform 0.2s;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.1);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c9a962;
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }
          `}</style>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
