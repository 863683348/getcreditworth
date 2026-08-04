/**
 * Amazon 区域切换器
 *
 * 两种形态：
 * - variant="full"（默认）：首页 "Data source" 区块，带标题与说明，作为数据源展示。
 * - variant="compact"：Header 用的紧凑下拉，全站可见，便于用户在任意页面切换区域。
 *
 * 两者共用同一个 RegionProvider Context，因此在任一处切换都会同步更新（并持久化到 localStorage）。
 * 区域选择决定 affiliate 链接路由到哪个 Amazon 商店（TLD + tag）。
 */
"use client";

import { Globe } from "lucide-react";
import { useRegion } from "@/components/RegionProvider";
import { VISIBLE_REGIONS, type AmazonRegion } from "@/lib/amazon-regions";

interface RegionSwitcherProps {
  variant?: "full" | "compact";
}

export function RegionSwitcher({ variant = "full" }: RegionSwitcherProps) {
  const { region, setRegion } = useRegion();

  if (variant === "compact") {
    return (
      <label
        className="flex items-center gap-2 rounded-md border border-border bg-bg-base px-2.5 py-2 text-text-secondary hover:border-primary-200 hover:text-primary transition-colors duration-150"
        title="Choose your Amazon region"
      >
        <Globe className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">Select Amazon region</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as AmazonRegion)}
          aria-label="Select Amazon region"
          className="bg-transparent text-xs sm:text-sm font-medium text-current outline-none cursor-pointer"
        >
          {VISIBLE_REGIONS.map((r) => (
            <option key={r.id} value={r.id} className="text-text-primary">
              {r.domain}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <section
      aria-label="Select your Amazon region"
      className="mb-8 p-4 sm:p-5 rounded-xl bg-bg-surface border border-border"
    >
      <h2 className="text-sm font-semibold text-text-primary mb-1">
        Data source
      </h2>
      <p className="text-xs text-text-secondary mb-3">
        Choose your Amazon region — affiliate links route to the matching store.
      </p>
      <ul className="flex flex-wrap gap-2">
        {VISIBLE_REGIONS.map((r) => {
          const active = r.id === region;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setRegion(r.id)}
                aria-pressed={active}
                title={`${r.label} (${r.domain})`}
                className={`min-h-[40px] px-3 py-1.5 text-xs sm:text-sm rounded-md border transition-colors duration-150 ${
                  active
                    ? "border-primary bg-primary text-white font-medium"
                    : "border-border bg-bg-base text-text-secondary hover:border-primary-200 hover:text-primary"
                }`}
              >
                {r.domain}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
