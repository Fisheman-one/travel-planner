import { create } from "zustand";
import { PlanPreferences, Plan, FullPlanResult, Attraction } from "@/types/plan";

interface PlanState {
  planId: string | null;
  plan: Plan | null;
  status: "idle" | "generating" | "completed" | "failed";
  progress: number;
  error: string | null;

  // UI State
  selectedDayIndex: number | null;
  selectedAttractionId: string | null;
  editingMode: boolean;

  // Actions
  createPlan: (preferences: PlanPreferences) => Promise<string>;
  fetchPlan: (planId: string) => Promise<void>;
  setSelectedDay: (index: number | null) => void;
  setSelectedAttraction: (id: string | null) => void;
  toggleEditingMode: () => void;
  reorderAttraction: (
    dayIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void;
  replaceAttraction: (
    dayIndex: number,
    index: number,
    newAttraction: Attraction
  ) => void;
  resetPlan: () => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  planId: null,
  plan: null,
  status: "idle",
  progress: 0,
  error: null,
  selectedDayIndex: null,
  selectedAttractionId: null,
  editingMode: false,

  createPlan: async (preferences: PlanPreferences) => {
    set({ status: "generating", progress: 0, error: null });

    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, preferences }),
      });

      if (!response.ok) {
        throw new Error("创建计划失败");
      }

      const data = await response.json();

      // Start SSE stream for updates
      const eventSource = new EventSource(
        `/api/plan/${planId}?preferences=${encodeURIComponent(JSON.stringify(preferences))}`
      );

      eventSource.onmessage = (event) => {
        const update = JSON.parse(event.data);

        if (update.type === "progress") {
          set({ progress: update.progress });
        } else if (update.type === "complete") {
          set({
            plan: update.result,
            status: "completed",
            progress: 100,
          });
          eventSource.close();
        } else if (update.type === "error") {
          set({ status: "failed", error: update.error });
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        set({ status: "failed", error: "连接中断" });
        eventSource.close();
      };

      set({ planId });
      return planId;
    } catch (error) {
      set({
        status: "failed",
        error: error instanceof Error ? error.message : "未知错误",
      });
      throw error;
    }
  },

  fetchPlan: async (planId: string) => {
    set({ status: "generating" });

    try {
      const response = await fetch(`/api/plan/${planId}`);
      if (!response.ok) {
        throw new Error("获取计划失败");
      }
      const data = await response.json();
      set({ plan: data, status: data.status });
    } catch (error) {
      set({
        status: "failed",
        error: error instanceof Error ? error.message : "未知错误",
      });
    }
  },

  setSelectedDay: (index) => {
    set({ selectedDayIndex: index });
  },

  setSelectedAttraction: (id) => {
    set({ selectedAttractionId: id });
  },

  toggleEditingMode: () => {
    set((state) => ({ editingMode: !state.editingMode }));
  },

  reorderAttraction: (dayIndex, fromIndex, toIndex) => {
    set((state) => {
      if (!state.plan?.result) return state;

      const newDays = [...state.plan.result.days];
      const day = { ...newDays[dayIndex] };
      const attractions = [...day.attractions];
      const [removed] = attractions.splice(fromIndex, 1);
      attractions.splice(toIndex, 0, removed);

      day.attractions = attractions;
      newDays[dayIndex] = day;

      return {
        plan: {
          ...state.plan,
          result: { ...state.plan.result, days: newDays },
        },
      };
    });
  },

  replaceAttraction: (dayIndex, index, newAttraction) => {
    set((state) => {
      if (!state.plan?.result) return state;

      const newDays = [...state.plan.result.days];
      const day = { ...newDays[dayIndex] };
      day.attractions = [...day.attractions];
      day.attractions[index] = newAttraction;

      newDays[dayIndex] = day;

      return {
        plan: {
          ...state.plan,
          result: { ...state.plan.result, days: newDays },
        },
      };
    });
  },

  resetPlan: () => {
    set({
      planId: null,
      plan: null,
      status: "idle",
      progress: 0,
      error: null,
      selectedDayIndex: null,
      selectedAttractionId: null,
      editingMode: false,
    });
  },
}));
