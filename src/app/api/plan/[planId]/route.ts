import { NextRequest, NextResponse } from "next/server";
import { PlanPreferences } from "@/types/plan";
import { generateMockPlan } from "@/data/mock-itineraries";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const planId = searchParams.get("planId");
  const preferencesStr = searchParams.get("preferences");

  if (!planId || !preferencesStr) {
    return NextResponse.json(
      { error: "缺少必要的参数" },
      { status: 400 }
    );
  }

  try {
    const preferences: PlanPreferences = JSON.parse(preferencesStr);

    // 创建 SSE 流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // 模拟生成进度
        const progressSteps = [
          { progress: 10, message: "正在分析您的偏好..." },
          { progress: 25, message: "正在搜索热门景点..." },
          { progress: 40, message: "正在规划每日行程..." },
          { progress: 55, message: "正在计算最优路线..." },
          { progress: 70, message: "正在筛选特色餐厅..." },
          { progress: 85, message: "正在安排住宿..." },
          { progress: 95, message: "正在生成最终方案..." },
        ];

        for (const step of progressSteps) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "progress", ...step })}\n\n`)
          );
        }

        // 生成最终结果
        const result = generateMockPlan(preferences);

        if (result) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "complete", result })}\n\n`
            )
          );
        } else {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: "无法生成行程，请稍后重试",
              })}\n\n`
            )
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
