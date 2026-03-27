/**
 * 第三方API服务
 * 使用天聚数行API获取真实景点数据
 */

const TIAN_API_KEY = process.env.TIAN_API_KEY || "a28cb8526c015f04218adb73020f7e71";
const TIAN_API_BASE = "https://apis.tianapi.com";

export interface TianScenicSpot {
  name: string;
  content: string;
  province: string;
  city: string;
}

export interface TianApiResponse {
  code: number;
  msg: string;
  result: {
    list: TianScenicSpot[];
  };
}

/**
 * 从天聚API获取城市景点列表
 */
export async function getScenicSpotsByCity(city: string): Promise<TianScenicSpot[]> {
  try {
    const url = `${TIAN_API_BASE}/scenic/index?key=${TIAN_API_KEY}&city=${encodeURIComponent(city)}`;
    const response = await fetch(url, { next: { revalidate: 3600 } }); // 缓存1小时

    if (!response.ok) {
      console.error("TianAPI fetch failed:", response.status);
      return [];
    }

    const data: TianApiResponse = await response.json();

    if (data.code === 200) {
      return data.result.list || [];
    }

    console.error("TianAPI error:", data.msg);
    return [];
  } catch (error) {
    console.error("TianAPI fetch error:", error);
    return [];
  }
}

/**
 * 搜索景点
 */
export async function searchScenicSpots(city: string, keyword: string): Promise<TianScenicSpot[]> {
  try {
    const url = `${TIAN_API_BASE}/scenic/index?key=${TIAN_API_KEY}&city=${encodeURIComponent(city)}&word=${encodeURIComponent(keyword)}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return [];
    }

    const data: TianApiResponse = await response.json();

    if (data.code === 200) {
      return data.result.list || [];
    }

    return [];
  } catch (error) {
    console.error("TianAPI search error:", error);
    return [];
  }
}
