import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * ISR 按需重新验证路由
 * POST /api/revalidate
 *
 * 用于数据更新后手动/自动触发页面重新生成。
 * 可由 GitHub Action 在数据更新脚本执行后调用。
 *
 * Body: { secret: string, paths?: string[] }
 * - secret: 与 REVALIDATE_SECRET 环境变量匹配
 * - paths:  可选，指定要重新验证的路径列表。
 *           不传时默认重新验证所有关键页面。
 */
const DEFAULT_PATHS = [
  "/",
  "/books",
  "/curated",
  "/blog",
  "/compare",
  "/calculator",
  "/favorites",
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      secret?: string;
      paths?: string[];
    };

    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: "REVALIDATE_SECRET not configured on server" },
        { status: 500 },
      );
    }
    if (body.secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 },
      );
    }

    const paths =
      body.paths && body.paths.length > 0 ? body.paths : DEFAULT_PATHS;

    const results: { path: string; revalidated: boolean }[] = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, revalidated: true });
      } catch {
        results.push({ path, revalidated: false });
      }
    }

    const allOk = results.every((r) => r.revalidated);

    return NextResponse.json(
      {
        revalidated: allOk,
        paths: results,
        timestamp: new Date().toISOString(),
      },
      { status: allOk ? 200 : 500 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Revalidation failed", message },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({
    status: "ready",
    message:
      "POST to this endpoint with { secret } to trigger ISR revalidation",
  });
}
