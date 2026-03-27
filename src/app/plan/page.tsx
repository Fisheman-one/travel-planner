"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWizardStore, STEPS, STEP_LABELS } from "@/store/wizardStore";
import { Progress, StepIndicator } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { StepDestination } from "@/components/wizard/StepDestination";
import { StepDates } from "@/components/wizard/StepDates";
import { StepBudget } from "@/components/wizard/StepBudget";
import { StepCompanions } from "@/components/wizard/StepCompanions";
import { StepMobility } from "@/components/wizard/StepMobility";
import { StepFood } from "@/components/wizard/StepFood";
import { StepAttractions } from "@/components/wizard/StepAttractions";
import { StepSpecial } from "@/components/wizard/StepSpecial";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  destination: StepDestination,
  dates: StepDates,
  budget: StepBudget,
  companions: StepCompanions,
  mobility: StepMobility,
  food: StepFood,
  attractions: StepAttractions,
  special: StepSpecial,
};

export default function PlanPage() {
  const router = useRouter();
  const {
    currentStep,
    stepIndex,
    preferences,
    nextStep,
    prevStep,
    validateStep,
    isValid,
    errors,
    getCompletedSteps,
  } = useWizardStore();

  const completedSteps = getCompletedSteps();

  const handleNext = () => {
    if (stepIndex === STEPS.length - 1) {
      // Final step - generate plan
      router.push(`/plan/result/demo`);
    } else {
      nextStep();
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      router.push(`/plan/result/demo`);
    }
  };

  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">返回</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary">
                {stepIndex + 1}
              </span>
              <span className="text-text-muted">/</span>
              <span className="text-text-muted">{STEPS.length}</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Progress
            value={((stepIndex + 1) / STEPS.length) * 100}
            size="sm"
            className="mb-4"
          />
          <StepIndicator
            steps={Object.values(STEP_LABELS)}
            currentStep={stepIndex + 1}
            completedSteps={completedSteps.map((s) => STEPS.indexOf(s))}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
              {/* Step title */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
                  {STEP_LABELS[currentStep]}
                </h1>
                <p className="mt-2 text-text-muted">
                  {getStepDescription(currentStep)}
                </p>
              </div>

              {/* Step content */}
              <div className="min-h-[300px]">
                {CurrentStepComponent && <CurrentStepComponent />}
              </div>

              {/* Error message */}
              {errors[currentStep] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {errors[currentStep]}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={stepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>

          {stepIndex === STEPS.length - 1 ? (
            <Button
              variant="secondary"
              onClick={handleSubmit}
              isLoading={false}
              className="gap-2"
            >
              生成我的专属行程
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              下一步
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function getStepDescription(step: string): string {
  const descriptions: Record<string, string> = {
    destination: "选择您想去的城市，开启旅程的第一步",
    dates: "规划您的出行时间，让每一天都充实美好",
    budget: "设定预算范围，找到性价比最高的体验",
    companions: "告诉我们同行者的信息，让行程更贴心",
    mobility: "评估体力状况，制定舒适的游览节奏",
    food: "选择喜欢的美食，让味蕾也踏上旅程",
    attractions: "挑选感兴趣的景点类型，发现专属体验",
    special: "留下任何特殊需求，我们会认真对待",
  };
  return descriptions[step] || "";
}
