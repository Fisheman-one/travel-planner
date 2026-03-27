/**
 * 行程计算引擎
 * 根据用户偏好和真实价格数据生成行程
 */

import {
  PlanPreferences,
  FullPlanResult,
  DayPlan,
  Attraction,
  Meal,
  Meals,
  Accommodation,
  BudgetLevel,
  FoodBudget,
  FitnessLevel,
  ActivityBudget,
  BudgetBreakdown,
  DailyBudget,
  BudgetCategory,
  Relationship,
  AgeRange,
  FoodPreference,
  AttractionType,
} from "@/types/plan";

import { getScenicSpotsByCity, TianScenicSpot } from "@/lib/api-service";

import {
  ATTRACTION_PRICES,
  ATTRACTION_DURATION,
  DEFAULT_ATTRACTION_DURATION,
  MEAL_PRICES,
  TRANSPORT_COSTS,
  ACCOMMODATION_PRICES,
  RECOMMENDED_HOTELS,
  LOCAL_FOODS,
  INTER_ATTRACTION_TRANSPORT,
  MISC_FEE_PERCENTAGE,
  getCityAttractions,
  getMealPrices,
  getTransportCosts,
  getAccommodationPrice,
} from "@/data/pricing";

import { generateId } from "@/lib/utils";

export class ItineraryEngine {
  /**
   * 根据用户偏好生成完整行程
   */
  generateItinerary(preferences: Partial<PlanPreferences>): FullPlanResult {
    const destination = preferences.destination || { city: "上海", country: "中国", coordinates: [121.47, 31.23] as [number, number] };
    const dates = preferences.dates || { startDate: "2024-04-01", endDate: "2024-04-04", days: 3 };
    const budget = preferences.budget || { level: "moderate" as BudgetLevel };
    const companions = preferences.companions || { count: 1, relationship: "solo" as Relationship, ageRange: "26-30" as AgeRange };
    const mobility = preferences.mobility || { fitnessLevel: "moderate" as FitnessLevel, mobilityAid: false, walkingTolerance: 5 };
    const food = preferences.food || { preferences: ["local"] as FoodPreference[], budget: "moderate" as FoodBudget, mustTry: [] };
    const attractions = preferences.attractions || { types: [] as AttractionType[], mustInclude: [], mustExclude: [] };

    const city = destination.city;
    const days = dates.days;
    const peopleCount = companions.count;

    // 1. 选择景点（根据类型偏好和体力）
    const selectedAttractions = this.selectAttractions(city, attractions.types, {
      fitnessLevel: mobility.fitnessLevel,
      walkingTolerance: mobility.walkingTolerance,
      mustInclude: attractions.mustInclude,
      mustExclude: attractions.mustExclude,
    });

    // 2. 生成每日安排
    const dailyPlans = this.generateDailyPlans(
      city,
      selectedAttractions,
      days,
      mobility.fitnessLevel,
      budget.level
    );

    // 3. 计算餐饮
    const allMeals = this.calculateMeals(city, days, food.budget, food.preferences);

    // 4. 选择住宿
    const accommodation = this.selectAccommodation(
      city,
      budget.level,
      companions.ageRange
    );

    // 5. 计算每日预算分解
    const { budgetBreakdown, dailyBreakdowns } = this.calculateBudgetBreakdown(
      city,
      dailyPlans,
      allMeals,
      accommodation,
      companions
    );

    // 6. 组装最终结果
    const resultDays: DayPlan[] = dailyPlans.map((dayAttractions, index) => ({
      dayNumber: index + 1,
      date: this.calculateDate(dates.startDate, index),
      theme: this.generateDayTheme(dayAttractions, index, days),
      attractions: dayAttractions,
      meals: allMeals[index],
      accommodation: index === 0 ? accommodation : undefined,
      dailyBudget: dailyBreakdowns[index]?.total || 0,
      budgetBreakdown: dailyBreakdowns[index]?.breakdown || [],
    }));

    // 7. 生成亮点和提示
    const highlights = this.generateHighlights(resultDays);
    const tips = this.generateTips(destination.city, mobility.fitnessLevel, budget.level);

    return {
      days: resultDays,
      totalBudget: budgetBreakdown.total,
      highlights,
      tips,
      budgetBreakdown,
    };
  }

  /**
   * 根据偏好选择景点
   */
  private selectAttractions(
    city: string,
    types: string[],
    options: {
      fitnessLevel?: FitnessLevel;
      walkingTolerance?: number;
      mustInclude?: string[];
      mustExclude?: string[];
    }
  ): Attraction[][] {
    const cityAttractions = this.getCityAttractionsPool(city);
    const fitnessLevel = options.fitnessLevel || "moderate";
    const mustInclude = options.mustInclude || [];
    const mustExclude = options.mustExclude || [];

    // 过滤类型和排除项
    let filtered = cityAttractions.filter((attr) => {
      if (types.length > 0 && !types.includes(attr.type)) return false;
      if (mustExclude.includes(attr.name)) return false;
      return true;
    });

    // 按体力筛选游览时长
    filtered = filtered.filter((attr) => {
      const maxDuration = ATTRACTION_DURATION[attr.name]?.[fitnessLevel] ||
        DEFAULT_ATTRACTION_DURATION[fitnessLevel];
      return attr.duration <= maxDuration + 30; // 允许30分钟弹性
    });

    // 必须包含的景点优先
    const mustIncludeAttrs = filtered.filter((attr) => mustInclude.includes(attr.name));
    const otherAttrs = filtered.filter((attr) => !mustInclude.includes(attr.name));

    // 打乱其他景点顺序
    const shuffled = this.shuffleArray(otherAttrs);

    // 合并
    const prioritized = [...mustIncludeAttrs, ...shuffled];

    // 按体力决定每天景点数量
    const attractionsPerDay = this.getAttractionsPerDay(fitnessLevel);
    const days = 3; // 默认3天
    const result: Attraction[][] = [];

    for (let i = 0; i < days; i++) {
      const start = i * attractionsPerDay;
      const dayAttrs = prioritized.slice(start, start + attractionsPerDay);
      if (dayAttrs.length > 0) {
        result.push(dayAttrs);
      }
    }

    // 确保每天至少有一个景点
    while (result.length < days && result[result.length - 1]?.length >= attractionsPerDay) {
      result.push([]);
    }

    return result.length > 0 ? result : [prioritized.slice(0, attractionsPerDay)];
  }

  /**
   * 获取城市景点池
   */
  private getCityAttractionsPool(city: string): Attraction[] {
    const prices = ATTRACTION_PRICES[city] || ATTRACTION_PRICES["上海"];
    const pool: Attraction[] = [];

    // 从mock数据中获取坐标等信息，这里简化处理
    Object.entries(prices).forEach(([name, price], index) => {
      const type = this.guessAttractionType(name);
      pool.push({
        id: `attr_${city}_${index}`,
        name,
        coordinates: [0, 0], // 简化处理
        address: city,
        arrivalTime: "09:00",
        departureTime: "12:00",
        duration: 120,
        transportation: { to: "地铁", duration: 30 },
        ticketInfo: price === 0 ? "免费" : `¥${price}`,
        highlights: [],
        tips: "",
        type,
        priority: index,
      });
    });

    return pool;
  }

  /**
   * 猜测景点类型
   */
  private guessAttractionType(name: string): Attraction["type"] {
    const keywordMap: Record<string, Attraction["type"][]> = {
      "博物馆": ["museum"],
      "寺": ["historical"],
      "塔": ["historical"],
      "庙": ["historical"],
      "园": ["nature"],
      "湖": ["nature"],
      "山": ["nature"],
      "公园": ["nature"],
      "街": ["shopping"],
      "路": ["shopping"],
      "城": ["historical", "entertainment"],
      "宫": ["historical"],
      "阁": ["historical"],
    };

    for (const [keyword, types] of Object.entries(keywordMap)) {
      if (name.includes(keyword)) {
        return types[0];
      }
    }

    return "historical";
  }

  /**
   * 根据体力获取每天景点数量
   */
  private getAttractionsPerDay(fitnessLevel: FitnessLevel): number {
    switch (fitnessLevel) {
      case "low": return 2;
      case "high": return 4;
      default: return 3;
    }
  }

  /**
   * 生成每日安排
   */
  private generateDailyPlans(
    city: string,
    attractionsByDay: Attraction[][],
    totalDays: number,
    fitnessLevel: FitnessLevel,
    budgetLevel: BudgetLevel
  ): Attraction[][] {
    const result: Attraction[][] = [];
    let currentTime = 9 * 60; // 9:00 in minutes

    for (let day = 0; day < totalDays; day++) {
      const dayAttractions = attractionsByDay[day] || [];
      const adjustedAttractions: Attraction[] = [];

      currentTime = 9 * 60; // 每天从9点开始

      for (let i = 0; i < dayAttractions.length; i++) {
        const attr = { ...dayAttractions[i] };
        const duration = ATTRACTION_DURATION[attr.name]?.[fitnessLevel] ||
          DEFAULT_ATTRACTION_DURATION[fitnessLevel];

        // 计算到达和离开时间
        attr.arrivalTime = this.minutesToTime(currentTime);
        attr.departureTime = this.minutesToTime(currentTime + duration);
        attr.duration = duration;

        // 估算交通时间（景点间）
        if (i > 0) {
          const prevAttr = adjustedAttractions[i - 1];
          const transportTime = this.estimateTransportTime(prevAttr, attr, city);
          attr.transportation = {
            to: this.guessTransportMode(prevAttr, attr),
            duration: transportTime,
          };
        }

        adjustedAttractions.push(attr);
        currentTime += duration + attr.transportation.duration;
      }

      result.push(adjustedAttractions);
    }

    return result;
  }

  /**
   * 估算景点间交通时间
   */
  private estimateTransportTime(from: Attraction, to: Attraction, city: string): number {
    // 简化估算：随机10-30分钟
    return Math.floor(Math.random() * 20) + 10;
  }

  /**
   * 猜测交通方式
   */
  private guessTransportMode(from: Attraction, to: Attraction): string {
    const distance = Math.abs(to.coordinates[0] - from.coordinates[0]) +
      Math.abs(to.coordinates[1] - from.coordinates[1]);

    if (distance < 0.01) return "步行";
    if (distance < 0.05) return "地铁/公交";
    return "打车";
  }

  /**
   * 分钟转时间字符串
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  /**
   * 计算餐饮
   */
  private calculateMeals(
    city: string,
    days: number,
    foodBudget: FoodBudget,
    preferences: string[]
  ): Meals[] {
    const mealPrices = MEAL_PRICES[city]?.economy || MEAL_PRICES["上海"].economy;
    const localFoods = LOCAL_FOODS[city] || LOCAL_FOODS["上海"];
    const result: Meals[] = [];

    for (let i = 0; i < days; i++) {
      const breakfastFood = localFoods[Math.floor(Math.random() * localFoods.length)];
      const lunchFood = localFoods[Math.floor(Math.random() * localFoods.length)];
      const dinnerFood = localFoods[Math.floor(Math.random() * localFoods.length)];

      result.push({
        breakfast: {
          name: breakfastFood?.name || "特色早餐",
          time: "08:00",
          budget: mealPrices.breakfast,
        },
        lunch: {
          name: lunchFood?.name || "午餐",
          time: "12:30",
          budget: mealPrices.lunch,
        },
        dinner: {
          name: dinnerFood?.name || "晚餐",
          time: "18:30",
          budget: mealPrices.dinner,
        },
      });
    }

    return result;
  }

  /**
   * 选择住宿
   */
  private selectAccommodation(
    city: string,
    budgetLevel: BudgetLevel,
    ageRange?: string
  ): Accommodation {
    const hotels = RECOMMENDED_HOTELS[city] || RECOMMENDED_HOTELS["上海"];
    const hotel = hotels[0]; // 选择第一家推荐酒店

    const price = getAccommodationPrice(city, hotel.star, budgetLevel);

    return {
      name: hotel.name,
      star: hotel.star,
      reason: hotel.reason,
      address: city,
      price,
    };
  }

  /**
   * 计算预算分解
   */
  private calculateBudgetBreakdown(
    city: string,
    dailyPlans: Attraction[][],
    allMeals: Meals[],
    accommodation: Accommodation,
    companions: { count: number; relationship: string; ageRange?: string }
  ): { budgetBreakdown: BudgetBreakdown; dailyBreakdowns: DailyBudget[] } {
    const peopleCount = companions.count || 1;
    const transportCosts = getTransportCosts(city);
    const accommodationPrice = accommodation.price || 500;

    const breakdown: ActivityBudget[] = [];
    const dailyBreakdowns: DailyBudget[] = [];
    let attractionsTotal = 0;
    let mealsTotal = 0;
    let transportTotal = 0;
    let accommodationTotal = 0;

    // 遍历每天
    dailyPlans.forEach((dayAttractions, dayIndex) => {
      const dayBreakdown: ActivityBudget[] = [];

      // 景点门票
      dayAttractions.forEach((attr) => {
        const price = ATTRACTION_PRICES[city]?.[attr.name] || 0;
        const subtotal = price * peopleCount;
        attractionsTotal += subtotal;

        breakdown.push({
          category: "attraction",
          name: attr.name,
          unitPrice: price,
          quantity: peopleCount,
          unit: "人",
          subtotal,
          note: attr.ticketInfo,
        });

        dayBreakdown.push({
          category: "attraction",
          name: attr.name,
          unitPrice: price,
          quantity: peopleCount,
          unit: "人",
          subtotal,
          note: attr.ticketInfo,
        });
      });

      // 餐饮
      const dayMeals = allMeals[dayIndex];
      if (dayMeals.breakfast) {
        const subtotal = dayMeals.breakfast.budget * peopleCount;
        mealsTotal += subtotal;
        breakdown.push({
          category: "meal",
          name: `早餐 - ${dayMeals.breakfast.name}`,
          unitPrice: dayMeals.breakfast.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
        dayBreakdown.push({
          category: "meal",
          name: `早餐 - ${dayMeals.breakfast.name}`,
          unitPrice: dayMeals.breakfast.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
      }
      if (dayMeals.lunch) {
        const subtotal = dayMeals.lunch.budget * peopleCount;
        mealsTotal += subtotal;
        breakdown.push({
          category: "meal",
          name: `午餐 - ${dayMeals.lunch.name}`,
          unitPrice: dayMeals.lunch.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
        dayBreakdown.push({
          category: "meal",
          name: `午餐 - ${dayMeals.lunch.name}`,
          unitPrice: dayMeals.lunch.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
      }
      if (dayMeals.dinner) {
        const subtotal = dayMeals.dinner.budget * peopleCount;
        mealsTotal += subtotal;
        breakdown.push({
          category: "meal",
          name: `晚餐 - ${dayMeals.dinner.name}`,
          unitPrice: dayMeals.dinner.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
        dayBreakdown.push({
          category: "meal",
          name: `晚餐 - ${dayMeals.dinner.name}`,
          unitPrice: dayMeals.dinner.budget,
          quantity: peopleCount,
          unit: "人",
          subtotal,
        });
      }

      // 交通
      const dailyTransport = transportCosts.subwayPerTrip * transportCosts.estimatedDailyTrips * peopleCount;
      transportTotal += dailyTransport;
      breakdown.push({
        category: "transport",
        name: "市内交通",
        unitPrice: transportCosts.subwayPerTrip,
        quantity: transportCosts.estimatedDailyTrips * peopleCount,
        unit: "次",
        subtotal: dailyTransport,
        note: "地铁/公交",
      });
      dayBreakdown.push({
        category: "transport",
        name: "市内交通",
        unitPrice: transportCosts.subwayPerTrip,
        quantity: transportCosts.estimatedDailyTrips * peopleCount,
        unit: "次",
        subtotal: dailyTransport,
        note: "地铁/公交",
      });

      // 住宿（只在第一天计算）
      if (dayIndex === 0 && accommodation.price) {
        // 分摊给每个人
        const dailyAccommodation = Math.ceil(accommodation.price / peopleCount);
        accommodationTotal += dailyAccommodation * peopleCount;
        breakdown.push({
          category: "accommodation",
          name: `住宿 - ${accommodation.name}`,
          unitPrice: accommodation.price,
          quantity: 1,
          unit: "晚",
          subtotal: accommodation.price,
          note: `人均 ¥${dailyAccommodation}/晚`,
        });
        dayBreakdown.push({
          category: "accommodation",
          name: `住宿 - ${accommodation.name}`,
          unitPrice: accommodation.price,
          quantity: 1,
          unit: "晚",
          subtotal: accommodation.price,
          note: `人均 ¥${dailyAccommodation}/晚`,
        });
      }

      const dayTotal = dayBreakdown.reduce((sum, item) => sum + item.subtotal, 0);
      dailyBreakdowns.push({
        dayNumber: dayIndex + 1,
        date: this.calculateDate("", dayIndex),
        total: dayTotal,
        breakdown: dayBreakdown,
      });
    });

    // 计算杂费
    const subtotalBeforeMisc = attractionsTotal + mealsTotal + transportTotal + accommodationTotal;
    const miscTotal = Math.round(subtotalBeforeMisc * MISC_FEE_PERCENTAGE);
    const total = subtotalBeforeMisc + miscTotal;
    const perPersonTotal = Math.round(total / peopleCount);

    breakdown.push({
      category: "misc",
      name: "杂费",
      unitPrice: subtotalBeforeMisc,
      quantity: 1,
      unit: "",
      subtotal: miscTotal,
      note: "旅游纪念品、应急等（5%）",
    });

    return {
      budgetBreakdown: {
        total,
        attractionsTotal,
        mealsTotal,
        transportTotal,
        accommodationTotal,
        miscTotal,
        perPersonTotal,
        breakdown,
        dailyBreakdowns,
      },
      dailyBreakdowns,
    };
  }

  /**
   * 计算日期
   */
  private calculateDate(startDate: string, dayOffset: number): string {
    if (!startDate) {
      // 默认为2024年的日期
      const baseDate = new Date(2024, 3, 1); // 2024年4月1日
      baseDate.setDate(baseDate.getDate() + dayOffset);
      return baseDate.toISOString().split("T")[0];
    }

    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split("T")[0];
  }

  /**
   * 生成每日主题
   */
  private generateDayTheme(attractions: Attraction[], dayIndex: number, totalDays: number): string {
    if (dayIndex === 0) return "抵达日 - 城市初印象";
    if (dayIndex === totalDays - 1) return "离别日 - 精彩收尾";

    const types = attractions.map((a) => a.type);
    if (types.includes("historical")) return "历史人文之旅";
    if (types.includes("nature")) return "自然风光之旅";
    if (types.includes("museum")) return "博物馆探索之旅";
    if (types.includes("shopping")) return "购物休闲之旅";

    return `第${dayIndex + 1}天 - 精彩探索`;
  }

  /**
   * 生成亮点
   */
  private generateHighlights(days: DayPlan[]): string[] {
    const highlights: string[] = [];

    days.forEach((day) => {
      day.attractions.forEach((attr) => {
        if (attr.highlights.length > 0) {
          highlights.push(`${attr.name} - ${attr.highlights[0]}`);
        }
      });
    });

    return highlights.slice(0, 5);
  }

  /**
   * 生成提示
   */
  private generateTips(city: string, fitnessLevel: FitnessLevel, budgetLevel: BudgetLevel): string[] {
    const tips: string[] = [];
    const transportCosts = getTransportCosts(city);

    tips.push(`建议购买城市交通卡，每日交通约 ¥${transportCosts.subwayPerTrip * transportCosts.estimatedDailyTrips}`);

    if (budgetLevel === "budget") {
      tips.push("选择经济型餐饮，本地小吃是性价比之选");
    } else if (budgetLevel === "luxury" || budgetLevel === "ultra-luxury") {
      tips.push("高端餐厅建议提前预约，特色体验不容错过");
    }

    if (fitnessLevel === "low") {
      tips.push("行程安排较轻松，注意休息，保持体力");
    } else if (fitnessLevel === "high") {
      tips.push("体力充沛，可以安排更多景点，但也要注意安全");
    }

    tips.push("热门景点建议提前在线购票");

    return tips;
  }

  /**
   * 使用真实API景点数据生成行程（异步）
   */
  async generateItineraryWithRealAttractions(preferences: Partial<PlanPreferences>): Promise<FullPlanResult> {
    const destination = preferences.destination || { city: "上海", country: "中国", coordinates: [121.47, 31.23] as [number, number] };
    const dates = preferences.dates || { startDate: "2024-04-01", endDate: "2024-04-04", days: 3 };
    const budget = preferences.budget || { level: "moderate" as BudgetLevel };
    const companions = preferences.companions || { count: 1, relationship: "solo" as Relationship, ageRange: "26-30" as AgeRange };
    const mobility = preferences.mobility || { fitnessLevel: "moderate" as FitnessLevel, mobilityAid: false, walkingTolerance: 5 };
    const food = preferences.food || { preferences: ["local"] as FoodPreference[], budget: "moderate" as FoodBudget, mustTry: [] };
    const attractions = preferences.attractions || { types: [] as AttractionType[], mustInclude: [], mustExclude: [] };

    const city = destination.city;
    const days = dates.days;
    const peopleCount = companions.count;

    // 1. 从API获取真实景点数据
    const realAttractions = await getScenicSpotsByCity(city);

    // 2. 将API景点转换为Attraction对象，匹配价格
    const apiAttractionPool = this.convertApiAttractions(realAttractions, city);

    // 3. 选择景点（根据类型偏好、体力）
    const selectedAttractions = this.selectAttractionsFromPool(
      city,
      apiAttractionPool,
      attractions.types,
      {
        fitnessLevel: mobility.fitnessLevel,
        walkingTolerance: mobility.walkingTolerance,
        mustInclude: attractions.mustInclude,
        mustExclude: attractions.mustExclude,
      }
    );

    // 4. 生成每日安排
    const dailyPlans = this.generateDailyPlans(
      city,
      selectedAttractions,
      days,
      mobility.fitnessLevel,
      budget.level
    );

    // 5. 计算餐饮
    const allMeals = this.calculateMeals(city, days, food.budget, food.preferences);

    // 6. 选择住宿
    const accommodation = this.selectAccommodation(
      city,
      budget.level,
      companions.ageRange
    );

    // 7. 计算每日预算分解
    const { budgetBreakdown, dailyBreakdowns } = this.calculateBudgetBreakdown(
      city,
      dailyPlans,
      allMeals,
      accommodation,
      companions
    );

    // 8. 组装最终结果
    const resultDays: DayPlan[] = dailyPlans.map((dayAttractions, index) => ({
      dayNumber: index + 1,
      date: this.calculateDate(dates.startDate, index),
      theme: this.generateDayTheme(dayAttractions, index, days),
      attractions: dayAttractions,
      meals: allMeals[index],
      accommodation: index === 0 ? accommodation : undefined,
      dailyBudget: dailyBreakdowns[index]?.total || 0,
      budgetBreakdown: dailyBreakdowns[index]?.breakdown || [],
    }));

    // 9. 生成亮点和提示
    const highlights = this.generateHighlights(resultDays);
    const tips = this.generateTips(destination.city, mobility.fitnessLevel, budget.level);

    return {
      days: resultDays,
      totalBudget: budgetBreakdown.total,
      highlights,
      tips,
      budgetBreakdown,
    };
  }

  /**
   * 将API景点转换为Attraction对象
   */
  private convertApiAttractions(apiSpots: TianScenicSpot[], city: string): Attraction[] {
    const prices = ATTRACTION_PRICES[city] || ATTRACTION_PRICES["上海"];

    return apiSpots.map((spot, index) => {
      // 尝试匹配已知价格，否则使用默认价格
      const price = prices[spot.name] ?? this.estimateAttractionPrice(spot.name);
      const type = this.guessAttractionType(spot.name);

      return {
        id: `attr_api_${city}_${index}`,
        name: spot.name,
        coordinates: [0, 0] as [number, number],
        address: spot.city,
        arrivalTime: "09:00",
        departureTime: "12:00",
        duration: 120,
        transportation: { to: "地铁", duration: 30 },
        ticketInfo: price === 0 ? "免费" : `¥${price}`,
        highlights: [spot.content.substring(0, 50) + "..."],
        tips: "",
        type,
        priority: index,
      };
    });
  }

  /**
   * 估算景点门票价格（当没有确切价格时）
   */
  private estimateAttractionPrice(name: string): number {
    // 免费景点特征词
    const freeKeywords = ["公园", "广场", "古街", "老街", "博物馆", "纪念馆", "图书馆"];
    for (const kw of freeKeywords) {
      if (name.includes(kw)) return 0;
    }

    // 低价景点（20-40元）
    const lowPriceKeywords = ["塔", "寺", "庙", "阁", "亭"];
    for (const kw of lowPriceKeywords) {
      if (name.includes(kw)) return 30;
    }

    // 中价景点（40-80元）
    const midPriceKeywords = ["园", "馆", "宫", "城墙"];
    for (const kw of midPriceKeywords) {
      if (name.includes(kw)) return 60;
    }

    // 默认中等价格
    return 50;
  }

  /**
   * 从景点池中选择景点（兼容API数据和原有数据）
   */
  private selectAttractionsFromPool(
    city: string,
    pool: Attraction[],
    types: string[],
    options: {
      fitnessLevel?: FitnessLevel;
      walkingTolerance?: number;
      mustInclude?: string[];
      mustExclude?: string[];
    }
  ): Attraction[][] {
    const fitnessLevel = options.fitnessLevel || "moderate";
    const mustInclude = options.mustInclude || [];
    const mustExclude = options.mustExclude || [];

    // 过滤类型和排除项
    let filtered = pool.filter((attr) => {
      if (types.length > 0 && !types.includes(attr.type)) return false;
      if (mustExclude.includes(attr.name)) return false;
      return true;
    });

    // 按体力筛选游览时长
    filtered = filtered.filter((attr) => {
      const maxDuration = ATTRACTION_DURATION[attr.name]?.[fitnessLevel] ||
        DEFAULT_ATTRACTION_DURATION[fitnessLevel];
      return attr.duration <= maxDuration + 30;
    });

    // 必须包含的景点优先
    const mustIncludeAttrs = filtered.filter((attr) => mustInclude.includes(attr.name));
    const otherAttrs = filtered.filter((attr) => !mustInclude.includes(attr.name));

    // 打乱其他景点顺序
    const shuffled = this.shuffleArray(otherAttrs);

    // 合并
    const prioritized = [...mustIncludeAttrs, ...shuffled];

    // 按体力决定每天景点数量
    const attractionsPerDay = this.getAttractionsPerDay(fitnessLevel);
    const days = 3;
    const result: Attraction[][] = [];

    for (let i = 0; i < days; i++) {
      const start = i * attractionsPerDay;
      const dayAttrs = prioritized.slice(start, start + attractionsPerDay);
      if (dayAttrs.length > 0) {
        result.push(dayAttrs);
      }
    }

    // 确保每天至少有一个景点
    while (result.length < days && result[result.length - 1]?.length >= attractionsPerDay) {
      result.push([]);
    }

    return result.length > 0 ? result : [prioritized.slice(0, attractionsPerDay)];
  }

  /**
   * 打乱数组顺序
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// 导出单例
export const itineraryEngine = new ItineraryEngine();
