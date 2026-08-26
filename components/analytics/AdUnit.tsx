"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9043592188127461";

interface AdUnitProps {
  /** AdSense 后台创建广告单元后获得的 Slot ID（纯数字） */
  slot: string;
  /** 广告格式：auto 自适应 / rectangle 矩形 / vertical 竖版 / horizontal 横版 */
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  /** 是否开启全宽自适应 */
  fullWidthResponsive?: boolean;
  className?: string;
  /** 容器最小高度，避免广告加载前布局抖动（CLS）。
   *  默认按格式预留合理空间：auto 280 / rectangle 250 / vertical 600 / horizontal 100，
   *  减少广告异步注入导致的累积布局偏移（Core Web Vitals - CLS）。 */
  minHeight?: number;
}

// 不同格式广告的典型高度，用于预留空间降低 CLS
const FORMAT_MIN_HEIGHT: Record<NonNullable<AdUnitProps["format"]>, number> = {
  auto: 280,
  rectangle: 250,
  vertical: 600,
  horizontal: 100,
};

/**
 * 手动广告位组件。
 *
 * 用法：
 *   1. 在 AdSense 后台「广告」→「按广告单元」创建展示广告，复制 Slot ID
 *   2. <AdUnit slot="1234567890" />
 *
 * 注意：每个 ins 元素只应 push 一次，组件用 ref 守卫避免重复。
 */
export function AdUnit({
  slot,
  format = "auto",
  fullWidthResponsive = true,
  className,
  minHeight = FORMAT_MIN_HEIGHT[format],
}: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    const el = insRef.current;
    // 防止 React 严格模式 / 重复渲染导致多次 push
    if (el && (el as any).dataset.adsPushed) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
      if (el) (el as any).dataset.adsPushed = "true";
    } catch {
      /* 忽略初始化异常，AdSense 脚本未就绪时无害 */
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div
      className={className}
      aria-label="Advertisement"
      style={{ minHeight, display: "flex", justifyContent: "center" }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
