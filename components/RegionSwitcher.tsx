/**
 * 首页区域切换器（Data source 区块）
 *
 * 既是数据源展示（列出可路由的 Amazon 区域站点），
 * 也是选择器：点击切换区域，affiliate 链接随之路由到对应 Amazon 商店。
 * 当前区域高亮，选择持久化在 localStorage。
 */
"use client";

import { useRegion } from "@/components/RegionProvider";
import { VISIBLE_REGIONS } from "@/lib/amazon-regions";

export function RegionSwitcher() {
  const { region, setRegion } = useRegion();

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
