/**
 * 真实价格数据库
 * 包含景点门票、餐饮、交通、住宿的真实价格数据
 * 价格参考2024年市场均价
 */

import { BudgetLevel, FoodBudget, FitnessLevel, AttractionType } from "@/types/plan";

// ============================================
// 景点门票价格（按城市、景点名称）
// ============================================
export const ATTRACTION_PRICES: Record<string, Record<string, number>> = {
  上海: {
    "外滩": 0,
    "南京路步行街": 0,
    "豫园": 40,
    "上海博物馆": 0,
    "田子坊": 0,
    "新天地": 0,
    "陆家嘴": 0,
    "东方明珠": 180,
    "上海中心大厦": 180,
    "环球金融中心": 120,
    "城隍庙": 10,
    "静安寺": 50,
    "淮海路": 0,
    "徐家汇": 0,
    "思南路": 0,
    "外滩观光隧道": 50,
    "浦江游览": 120,
    "上海当代艺术博物馆": 0,
    "1933老场坊": 0,
    "滨江公园": 0,
  },
  北京: {
    "故宫": 60,
    "天安门广场": 0,
    "天坛": 34,
    "颐和园": 60,
    "圆明园": 25,
    "长城(八达岭)": 45,
    "长城(慕田峪)": 40,
    "北海公园": 20,
    "景山公园": 10,
    "什刹海": 0,
    "南锣鼓巷": 0,
    "798艺术区": 0,
    "鸟巢": 80,
    "水立方": 30,
    "北京欢乐谷": 299,
    "雍和宫": 25,
    "恭王府": 40,
    "胡同游": 180,
    "国家博物馆": 0,
    "毛主席纪念堂": 0,
  },
  杭州: {
    "西湖": 0,
    "苏堤": 0,
    "断桥": 0,
    "雷峰塔": 40,
    "灵隐寺": 75,
    "飞来峰": 45,
    "龙井村": 0,
    "河坊街": 0,
    "宋城": 300,
    "千岛湖": 130,
    "西溪湿地": 80,
    "岳王庙": 25,
    "三潭印月": 55,
    "虎跑梦泉": 15,
    "六和塔": 20,
    "京杭大运河": 80,
    "中国丝绸博物馆": 0,
    "杭州动物园": 20,
    "太子湾公园": 0,
  },
  成都: {
    "大熊猫基地": 58,
    "宽窄巷子": 0,
    "锦里": 0,
    "武侯祠": 50,
    "杜甫草堂": 60,
    "青城山": 90,
    "都江堰": 90,
    "春熙路": 0,
    "太古里": 0,
    "九眼桥": 0,
    "文殊院": 0,
    "金沙遗址": 70,
    "成都博物馆": 0,
    "熊猫邮局": 0,
    "锦江夜游": 120,
  },
  西安: {
    "兵马俑": 120,
    "华清宫": 120,
    "城墙": 54,
    "大雁塔": 50,
    "小雁塔": 30,
    "钟楼": 30,
    "鼓楼": 30,
    "回民街": 0,
    "大明宫": 60,
    "大唐芙蓉园": 120,
    "永兴坊": 0,
    "陕西历史博物馆": 0,
    "碑林": 65,
    "大慈恩寺": 40,
    "骊山": 45,
  },
  大理: {
    "洱海": 0,
    "大理古城": 0,
    "苍山": 35,
    "三塔": 75,
    "喜洲古镇": 0,
    "双廊": 0,
    "南诏风情岛": 50,
    "洱海游船": 142,
    "蝴蝶泉": 60,
    "崇圣寺三塔": 75,
    "大理学院": 0,
    "周城": 0,
  },
  洛阳: {
    "龙门石窟": 90,
    "白马寺": 50,
    "关林": 40,
    "丽景门": 30,
    "洛阳古城": 0,
    "中国国花园": 50,
    "洛阳博物馆": 0,
    "天堂明堂": 90,
    "应天门": 60,
    "老城十字街": 0,
    "洛邑古城": 0,
    "白云山": 80,
    "龙潭大峡谷": 60,
  },
};

// ============================================
// 景点游览时长（分钟，按体力级别推荐）
// ============================================
export const ATTRACTION_DURATION: Record<string, Record<FitnessLevel, number>> = {
  "故宫": { low: 120, moderate: 180, high: 240 },
  "长城(八达岭)": { low: 180, moderate: 240, high: 300 },
  "颐和园": { low: 120, moderate: 180, high: 240 },
  "西湖": { low: 120, moderate: 180, high: 240 },
  "龙门石窟": { low: 150, moderate: 180, high: 240 },
  "白马寺": { low: 90, moderate: 120, high: 150 },
  "灵隐寺": { low: 120, moderate: 150, high: 180 },
  "外滩": { low: 60, moderate: 90, high: 120 },
  "豫园": { low: 90, moderate: 120, high: 150 },
};

// 默认游览时长
export const DEFAULT_ATTRACTION_DURATION: Record<FitnessLevel, number> = {
  low: 90,
  moderate: 120,
  high: 180,
};

// ============================================
// 餐饮价格（按城市、餐类型、预算级别，元/人）
// ============================================
export interface MealPrice {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export const MEAL_PRICES: Record<string, Record<FoodBudget, MealPrice>> = {
  上海: {
    economy: { breakfast: 25, lunch: 50, dinner: 80 },
    moderate: { breakfast: 50, lunch: 100, dinner: 180 },
    "fine-dining": { breakfast: 120, lunch: 300, dinner: 500 },
  },
  北京: {
    economy: { breakfast: 20, lunch: 45, dinner: 70 },
    moderate: { breakfast: 45, lunch: 90, dinner: 160 },
    "fine-dining": { breakfast: 100, lunch: 250, dinner: 450 },
  },
  杭州: {
    economy: { breakfast: 25, lunch: 50, dinner: 85 },
    moderate: { breakfast: 50, lunch: 100, dinner: 180 },
    "fine-dining": { breakfast: 110, lunch: 280, dinner: 480 },
  },
  成都: {
    economy: { breakfast: 20, lunch: 45, dinner: 75 },
    moderate: { breakfast: 40, lunch: 85, dinner: 150 },
    "fine-dining": { breakfast: 90, lunch: 220, dinner: 400 },
  },
  西安: {
    economy: { breakfast: 20, lunch: 45, dinner: 70 },
    moderate: { breakfast: 40, lunch: 80, dinner: 150 },
    "fine-dining": { breakfast: 90, lunch: 200, dinner: 380 },
  },
  大理: {
    economy: { breakfast: 20, lunch: 40, dinner: 65 },
    moderate: { breakfast: 40, lunch: 75, dinner: 130 },
    "fine-dining": { breakfast: 80, lunch: 180, dinner: 350 },
  },
  洛阳: {
    economy: { breakfast: 18, lunch: 40, dinner: 65 },
    moderate: { breakfast: 35, lunch: 70, dinner: 120 },
    "fine-dining": { breakfast: 80, lunch: 160, dinner: 300 },
  },
};

// ============================================
// 特色美食推荐（按城市）
// ============================================
export const LOCAL_FOODS: Record<string, { name: string; priceRange: string }[]> = {
  上海: [
    { name: "南翔小笼包", priceRange: "¥30-50" },
    { name: "生煎包", priceRange: "¥20-35" },
    { name: "本帮菜", priceRange: "¥100-200" },
    { name: "蟹粉小笼", priceRange: "¥80-120" },
    { name: "上海老饭店", priceRange: "¥150-300" },
  ],
  北京: [
    { name: "北京烤鸭", priceRange: "¥150-300" },
    { name: "炸酱面", priceRange: "¥25-50" },
    { name: "豆汁儿", priceRange: "¥10-20" },
    { name: "卤煮火烧", priceRange: "¥25-45" },
    { name: "涮羊肉", priceRange: "¥120-250" },
  ],
  杭州: [
    { name: "东坡肉", priceRange: "¥60-100" },
    { name: "龙井虾仁", priceRange: "¥80-150" },
    { name: "叫化鸡", priceRange: "¥80-120" },
    { name: "西湖醋鱼", priceRange: "¥70-120" },
    { name: "片儿川", priceRange: "¥25-40" },
  ],
  成都: [
    { name: "火锅", priceRange: "¥80-150" },
    { name: "串串香", priceRange: "¥50-100" },
    { name: "麻婆豆腐", priceRange: "¥30-50" },
    { name: "钟水饺", priceRange: "¥20-35" },
    { name: "赖汤圆", priceRange: "¥15-30" },
  ],
  西安: [
    { name: "肉夹馍", priceRange: "¥15-25" },
    { name: "羊肉泡馍", priceRange: "¥35-60" },
    { name: "凉皮", priceRange: "¥10-20" },
    { name: "biangbiang面", priceRange: "¥20-35" },
    { name: "贾三汤包", priceRange: "¥30-50" },
  ],
  大理: [
    { name: "乳扇", priceRange: "¥15-30" },
    { name: "饵丝", priceRange: "¥15-25" },
    { name: "酸菜鱼", priceRange: "¥50-80" },
    { name: "米凉虾", priceRange: "¥10-15" },
    { name: "砂锅鱼", priceRange: "¥80-150" },
  ],
  洛阳: [
    { name: "洛阳水席", priceRange: "¥80-150" },
    { name: "牛肉汤", priceRange: "¥20-35" },
    { name: "豆腐汤", priceRange: "¥15-25" },
    { name: "牡丹燕菜", priceRange: "¥40-60" },
    { name: "烫面角", priceRange: "¥20-30" },
  ],
};

// ============================================
// 交通费用基准（按城市）
// ============================================
export interface TransportBase {
  subwayPerTrip: number;      // 地铁每次均价
  taxiStartPrice: number;     // 打车起步价
  taxiPerKm: number;          // 打车每公里价格
  busPerTrip: number;         // 公交每次价格
  estimatedDailyTrips: number; // 预估每日出行次数
}

export const TRANSPORT_COSTS: Record<string, TransportBase> = {
  上海: { subwayPerTrip: 4, taxiStartPrice: 14, taxiPerKm: 2.4, busPerTrip: 2, estimatedDailyTrips: 4 },
  北京: { subwayPerTrip: 4, taxiStartPrice: 13, taxiPerKm: 2.3, busPerTrip: 2, estimatedDailyTrips: 4 },
  杭州: { subwayPerTrip: 3, taxiStartPrice: 11, taxiPerKm: 2.5, busPerTrip: 2, estimatedDailyTrips: 3 },
  成都: { subwayPerTrip: 3, taxiStartPrice: 9, taxiPerKm: 2.0, busPerTrip: 2, estimatedDailyTrips: 3 },
  西安: { subwayPerTrip: 3, taxiStartPrice: 10, taxiPerKm: 2.2, busPerTrip: 2, estimatedDailyTrips: 3 },
  大理: { subwayPerTrip: 0, taxiStartPrice: 8, taxiPerKm: 2.0, busPerTrip: 1.5, estimatedDailyTrips: 2 },
  洛阳: { subwayPerTrip: 2, taxiStartPrice: 8, taxiPerKm: 1.8, busPerTrip: 1.5, estimatedDailyTrips: 3 },
};

// 景点间交通估算（按距离分组）
export const INTER_ATTRACTION_TRANSPORT: Record<string, { avgDistance: number; mode: string }> = {
  "near": { avgDistance: 3, mode: "步行/公交" },     // < 5km
  "medium": { avgDistance: 10, mode: "地铁/打车" },   // 5-15km
  "far": { avgDistance: 25, mode: "打车/旅游专线" }, // > 15km
};

// ============================================
// 住宿价格（按城市、星级、预算级别，元/晚）
// ============================================
export const ACCOMMODATION_PRICES: Record<string, Record<number, Record<BudgetLevel, number>>> = {
  上海: {
    3: { budget: 280, moderate: 550, luxury: 1200, "ultra-luxury": 2800 },
    4: { budget: 450, moderate: 900, luxury: 1800, "ultra-luxury": 4000 },
    5: { budget: 900, moderate: 1800, luxury: 3500, "ultra-luxury": 8000 },
  },
  北京: {
    3: { budget: 250, moderate: 500, luxury: 1100, "ultra-luxury": 2500 },
    4: { budget: 400, moderate: 800, luxury: 1600, "ultra-luxury": 3500 },
    5: { budget: 800, moderate: 1600, luxury: 3000, "ultra-luxury": 7000 },
  },
  杭州: {
    3: { budget: 220, moderate: 450, luxury: 1000, "ultra-luxury": 2200 },
    4: { budget: 350, moderate: 700, luxury: 1400, "ultra-luxury": 3000 },
    5: { budget: 700, moderate: 1400, luxury: 2800, "ultra-luxury": 6000 },
  },
  成都: {
    3: { budget: 180, moderate: 350, luxury: 800, "ultra-luxury": 1800 },
    4: { budget: 280, moderate: 550, luxury: 1200, "ultra-luxury": 2500 },
    5: { budget: 550, moderate: 1100, luxury: 2200, "ultra-luxury": 5000 },
  },
  西安: {
    3: { budget: 160, moderate: 320, luxury: 750, "ultra-luxury": 1600 },
    4: { budget: 250, moderate: 500, luxury: 1100, "ultra-luxury": 2200 },
    5: { budget: 500, moderate: 1000, luxury: 2000, "ultra-luxury": 4500 },
  },
  大理: {
    3: { budget: 150, moderate: 300, luxury: 700, "ultra-luxury": 1500 },
    4: { budget: 230, moderate: 450, luxury: 950, "ultra-luxury": 2000 },
    5: { budget: 450, moderate: 900, luxury: 1800, "ultra-luxury": 4000 },
  },
  洛阳: {
    3: { budget: 140, moderate: 280, luxury: 650, "ultra-luxury": 1400 },
    4: { budget: 220, moderate: 420, luxury: 900, "ultra-luxury": 1800 },
    5: { budget: 420, moderate: 850, luxury: 1700, "ultra-luxury": 3500 },
  },
};

// 住宿推荐酒店（按城市和星级）
export const RECOMMENDED_HOTELS: Record<string, { name: string; star: number; reason: string }[]> = {
  上海: [
    { name: "上海半岛酒店", star: 5, reason: "外滩核心位置，奢华服务" },
    { name: "上海外滩华尔道夫酒店", star: 5, reason: "百年历史经典奢华" },
    { name: "上海金茂君悦大酒店", star: 5, reason: "陆家嘴核心，地标建筑" },
    { name: "上海艾本精品酒店", star: 4, reason: "法租界静谧优雅" },
    { name: "上海老饭店", star: 4, reason: "豫园附近，本地特色" },
  ],
  北京: [
    { name: "北京王府半岛酒店", star: 5, reason: "王府井核心，传统奢华" },
    { name: "北京长城脚下的公社", star: 5, reason: "长城脚下，世外桃源" },
    { name: "北京瑰丽酒店", star: 5, reason: "CBD核心，时尚奢华" },
    { name: "北京瑜舍", star: 5, reason: "三里屯， design hotel" },
    { name: "北京香格里拉", star: 5, reason: "金融街核心位置" },
  ],
  杭州: [
    { name: "杭州西子湖四季酒店", star: 5, reason: "紧邻西湖，园林式奢华" },
    { name: "杭州 Ritz-Carlton", star: 5, reason: "钱江新城，一线江景" },
    { name: "杭州法云安缦", star: 5, reason: "灵隐寺旁，世外桃源" },
    { name: "杭州西湖希尔顿", star: 4, reason: "西湖大道，交通便利" },
    { name: "杭州龙井村茶文化酒店", star: 4, reason: "茶园环绕，清新自然" },
  ],
  成都: [
    { name: "成都瑞吉酒店", star: 5, reason: "春熙路核心，奢华服务" },
    { name: "成都博舍", star: 5, reason: "太古里旁，设计酒店" },
    { name: "成都钓鱼台", star: 5, reason: "宽窄巷子旁，古典奢华" },
    { name: "成都香格里拉", star: 5, reason: "锦江畔，位置优越" },
    { name: "成都熊猫主题酒店", star: 4, reason: "熊猫基地旁，亲子首选" },
  ],
  西安: [
    { name: "西安香格里拉", star: 5, reason: "城南核心，大雁塔旁" },
    { name: "西安W酒店", star: 5, reason: "曲江新区，时尚地标" },
    { name: "西安华清御汤酒店", star: 5, reason: "华清宫内，温泉体验" },
    { name: "西安威斯汀", star: 5, reason: "大雁塔旁，位置优越" },
    { name: "西安钟楼饭店", star: 4, reason: "钟楼核心，交通便利" },
  ],
  大理: [
    { name: "大理洱海天域英迪格", star: 5, reason: "洱海边，海景房" },
    { name: "大理一号院", star: 5, reason: "苍山脚下，宁静致远" },
    { name: "大理悦榕庄", star: 5, reason: "洱海边，度假胜地" },
    { name: "大理古城希尔顿", star: 4, reason: "古城旁，交通便利" },
    { name: "大理双廊海景酒店", star: 4, reason: "双廊核心，一线海景" },
  ],
  洛阳: [
    { name: "洛阳牡丹大酒店", star: 5, reason: "市中心，交通便利" },
    { name: "洛阳东山宾馆", star: 5, reason: "龙门石窟旁，风景优美" },
    { name: "洛阳钼都利豪", star: 5, reason: "新区核心，商务首选" },
    { name: "洛阳牡丹城酒店", star: 4, reason: "老城核心，位置优越" },
    { name: "洛阳古城青年旅舍", star: 3, reason: "老城十字街旁，经济实惠" },
  ],
};

// ============================================
// 杂费估算（占总花费百分比）
// ============================================
export const MISC_FEE_PERCENTAGE = 0.05; // 5% 杂费（旅游纪念品、应急等）

// ============================================
// 辅助函数
// ============================================

/**
 * 获取城市的景点列表
 */
export function getCityAttractions(city: string): string[] {
  return Object.keys(ATTRACTION_PRICES[city] || {});
}

/**
 * 获取景点门票价格
 */
export function getAttractionPrice(city: string, attraction: string): number {
  return ATTRACTION_PRICES[city]?.[attraction] || 0;
}

/**
 * 获取餐饮价格
 */
export function getMealPrices(city: string, budget: FoodBudget): MealPrice {
  return MEAL_PRICES[city]?.[budget] || MEAL_PRICES["上海"].moderate;
}

/**
 * 获取交通基准费用
 */
export function getTransportCosts(city: string): TransportBase {
  return TRANSPORT_COSTS[city] || TRANSPORT_COSTS["上海"];
}

/**
 * 获取住宿价格
 */
export function getAccommodationPrice(city: string, star: number, budget: BudgetLevel): number {
  return ACCOMMODATION_PRICES[city]?.[star]?.[budget] || 500;
}

/**
 * 获取当地特色美食
 */
export function getLocalFoods(city: string): { name: string; priceRange: string }[] {
  return LOCAL_FOODS[city] || [];
}

/**
 * 获取推荐酒店
 */
export function getRecommendedHotels(city: string): { name: string; star: number; reason: string }[] {
  return RECOMMENDED_HOTELS[city] || [];
}
