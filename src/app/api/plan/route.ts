import { NextRequest, NextResponse } from "next/server";
import { PlanPreferences } from "@/types/plan";
import { generateMockPlan } from "@/data/mock-itineraries";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, preferences } = body as {
      planId: string;
      preferences: PlanPreferences;
    };

    // 验证必填字段
    if (!planId || !preferences?.destination?.city || !preferences?.dates?.days) {
      return NextResponse.json(
        { error: "缺少必要的参数" },
        { status: 400 }
      );
    }

    // 返回成功响应，触发客户端的SSE连接
    return NextResponse.json({
      planId,
      status: "generating",
      message: "开始生成行程...",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
