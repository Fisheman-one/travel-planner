import { create } from "zustand";
import {
  PlanPreferences,
  WizardStep,
  BudgetLevel,
  Relationship,
  AgeRange,
  FitnessLevel,
} from "@/types/plan";

interface WizardState {
  currentStep: WizardStep;
  stepIndex: number;
  preferences: Partial<PlanPreferences>;
  isValid: boolean;
  errors: Record<string, string>;

  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePreferences: (updates: Partial<PlanPreferences>) => void;
  validateStep: () => boolean;
  getValidationErrors: () => Record<string, string>;
  resetWizard: () => void;
  getCompletedSteps: () => WizardStep[];
}

const STEPS: WizardStep[] = [
  "destination",
  "dates",
  "budget",
  "companions",
  "mobility",
  "food",
  "attractions",
  "special",
];

const STEP_LABELS: Record<WizardStep, string> = {
  destination: "目的地",
  dates: "日期预算",
  budget: "预算",
  companions: "同行人",
  mobility: "体力",
  food: "餐饮",
  attractions: "景点",
  special: "特殊需求",
};

const initialPreferences = {
  destination: {
    city: "",
    country: "中国",
    coordinates: [121.4737, 31.2304],
  },
  dates: {
    startDate: "",
    endDate: "",
    days: 0,
  },
  budget: {
    level: undefined as BudgetLevel | undefined,
    amount: undefined as number | undefined,
  },
  companions: {
    count: 1,
    relationship: undefined as Relationship | undefined,
    ageRange: undefined as AgeRange | undefined,
  },
  mobility: {
    fitnessLevel: undefined as FitnessLevel | undefined,
    mobilityAid: false,
    walkingTolerance: 5,
  },
  food: {
    preferences: [] as string[],
    budget: "moderate" as const,
    mustTry: [] as string[],
  },
  attractions: {
    types: [] as string[],
    mustInclude: [] as string[],
    mustExclude: [] as string[],
  },
  special: {
    notes: "",
    accessibility: [] as string[],
    dietaryRestrictions: [] as string[],
  },
} as Partial<PlanPreferences>;

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: "destination",
  stepIndex: 0,
  preferences: initialPreferences,
  isValid: false,
  errors: {},

  setStep: (step) => {
    const index = STEPS.indexOf(step);
    set({ currentStep: step, stepIndex: index, errors: {} });
  },

  nextStep: () => {
    const { stepIndex, validateStep } = get();
    if (validateStep() && stepIndex < STEPS.length - 1) {
      const newIndex = stepIndex + 1;
      set({
        stepIndex: newIndex,
        currentStep: STEPS[newIndex],
        errors: {},
      });
    }
  },

  prevStep: () => {
    const { stepIndex } = get();
    if (stepIndex > 0) {
      const newIndex = stepIndex - 1;
      set({
        stepIndex: newIndex,
        currentStep: STEPS[newIndex],
        errors: {},
      });
    }
  },

  updatePreferences: (updates) => {
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    }));
  },

  validateStep: () => {
    const { currentStep, preferences, getValidationErrors } = get();
    const errors = getValidationErrors();
    const stepError = errors[currentStep];
    set({ errors, isValid: !stepError });
    return !stepError;
  },

  getValidationErrors: () => {
    const { currentStep, preferences } = get();
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case "destination":
        if (!preferences.destination?.city) {
          errors.destination = "请选择目的地";
        }
        break;
      case "dates":
        if (!preferences.dates?.startDate || !preferences.dates?.endDate) {
          errors.dates = "请选择旅行日期";
        } else if (preferences.dates.days < 1 || preferences.dates.days > 30) {
          errors.dates = "行程天数应在1-30天之间";
        }
        break;
      case "budget":
        if (!preferences.budget?.level) {
          errors.budget = "请选择预算级别";
        }
        break;
      case "companions":
        if (!preferences.companions?.relationship) {
          errors.companions = "请选择同行人关系";
        }
        break;
      case "mobility":
        if (!preferences.mobility?.fitnessLevel) {
          errors.mobility = "请选择体力水平";
        }
        break;
      case "food":
        if (preferences.food?.preferences?.length === 0) {
          errors.food = "请至少选择一种餐饮偏好";
        }
        break;
      case "attractions":
        if (preferences.attractions?.types?.length === 0) {
          errors.attractions = "请至少选择一种景点类型";
        }
        break;
    }

    return errors;
  },

  resetWizard: () => {
    set({
      currentStep: "destination",
      stepIndex: 0,
      preferences: initialPreferences,
      isValid: false,
      errors: {},
    });
  },

  getCompletedSteps: () => {
    const { preferences } = get();
    const completed: WizardStep[] = [];

    if (preferences.destination?.city) completed.push("destination");
    if (preferences.dates?.startDate) completed.push("dates");
    if (preferences.budget?.level) completed.push("budget");
    if (preferences.companions?.relationship) completed.push("companions");
    if (preferences.mobility?.fitnessLevel) completed.push("mobility");
    if (preferences.food?.preferences?.length) completed.push("food");
    if (preferences.attractions?.types?.length) completed.push("attractions");
    if (preferences.special?.notes) completed.push("special");

    return completed;
  },
}));

export { STEPS, STEP_LABELS };
