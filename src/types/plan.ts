export interface Destination {
  city: string;
  country: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface TravelDates {
  startDate: string;
  endDate: string;
  days: number;
}

export type BudgetLevel = "budget" | "moderate" | "luxury" | "ultra-luxury";

export interface Budget {
  level: BudgetLevel;
  amount?: number;
}

export type Relationship = "solo" | "couple" | "friends" | "family";
export type AgeRange = "20-25" | "26-30" | "31-35" | "36-45" | "45+";

export interface Companions {
  count: number;
  relationship: Relationship;
  ageRange: AgeRange;
}

export type FitnessLevel = "low" | "moderate" | "high";

export interface Mobility {
  fitnessLevel: FitnessLevel;
  mobilityAid: boolean;
  walkingTolerance: number; // 1-10
}

export type FoodPreference =
  | "local"
  | "vegetarian"
  | "halal"
  | "western"
  | "japanese"
  | "korean";
export type FoodBudget = "economy" | "moderate" | "fine-dining";

export interface Food {
  preferences: FoodPreference[];
  budget: FoodBudget;
  mustTry: string[];
}

export type AttractionType =
  | "museum"
  | "nature"
  | "historical"
  | "shopping"
  | "entertainment"
  | "food"
  | "nightlife";

export interface Attractions {
  types: AttractionType[];
  mustInclude: string[];
  mustExclude: string[];
}

export interface Special {
  notes: string;
  accessibility: string[];
  dietaryRestrictions: string[];
}

export interface PlanPreferences {
  destination: Destination;
  dates: TravelDates;
  budget: Budget;
  companions: Companions;
  mobility: Mobility;
  food: Food;
  attractions: Attractions;
  special: Special;
}

export interface Transportation {
  to: string;
  duration: number; // minutes
}

export interface Attraction {
  id: string;
  name: string;
  nameEn?: string;
  coordinates: [number, number];
  address: string;
  arrivalTime: string;
  departureTime: string;
  duration: number;
  transportation: Transportation;
  ticketInfo: string;
  highlights: string[];
  tips: string;
  type: AttractionType;
  priority: number;
}

export interface Meal {
  name: string;
  time: string;
  budget: number;
  address?: string;
}

export interface Meals {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
}

export interface Accommodation {
  name: string;
  star: number;
  reason: string;
  address: string;
  price?: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  attractions: Attraction[];
  meals: Meals;
  accommodation?: Accommodation;
  dailyBudget: number;
}

export interface FullPlanResult {
  days: DayPlan[];
  totalBudget: number;
  highlights: string[];
  tips: string[];
}

export interface Plan {
  id: string;
  preferences: PlanPreferences;
  result?: FullPlanResult;
  status: "generating" | "completed" | "failed";
  progress: number;
  createdAt: string;
}

export type WizardStep =
  | "destination"
  | "dates"
  | "budget"
  | "companions"
  | "mobility"
  | "food"
  | "attractions"
  | "special";

// 预算分解类型
export type BudgetCategory = "attraction" | "meal" | "transport" | "accommodation" | "misc";

export interface ActivityBudget {
  category: BudgetCategory;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  subtotal: number;
  note?: string;
}

export interface DailyBudget {
  dayNumber: number;
  date: string;
  total: number;
  breakdown: ActivityBudget[];
}

export interface BudgetBreakdown {
  total: number;
  attractionsTotal: number;
  mealsTotal: number;
  transportTotal: number;
  accommodationTotal: number;
  miscTotal: number;
  perPersonTotal: number;
  breakdown: ActivityBudget[];
  dailyBreakdowns: DailyBudget[];
}

// 更新 DayPlan 添加预算分解
export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  attractions: Attraction[];
  meals: Meals;
  accommodation?: Accommodation;
  dailyBudget: number;
  budgetBreakdown?: ActivityBudget[];
}

// 更新 FullPlanResult 添加预算分解
export interface FullPlanResult {
  days: DayPlan[];
  totalBudget: number;
  highlights: string[];
  tips: string[];
  budgetBreakdown?: BudgetBreakdown;
}
