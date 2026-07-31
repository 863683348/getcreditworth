/**
 * Amazon 区域切换 - Context + Provider + Hook
 * 区域选择基于 localStorage 持久化，首访按浏览器语言自动推测。
 *
 * 与 i18n 系统保持一致的架构（React Context + Provider + Hook）。
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { AmazonRegion, DEFAULT_REGION, detectRegionFromLocale, isValidRegion } from "@/lib/amazon-regions";

const STORAGE_KEY = "gcw-region";

interface RegionContextValue {
  region: AmazonRegion;
  setRegion: (region: AmazonRegion) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  // SSR/SSG 阶段默认 us，避免 hydration mismatch；挂载后再读 localStorage / 浏览器语言
  const [region, setRegionState] = useState<AmazonRegion>(DEFAULT_REGION);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidRegion(saved)) {
      setRegionState(saved);
    } else if (typeof navigator !== "undefined" && navigator.language) {
      setRegionState(detectRegionFromLocale(navigator.language));
    }
  }, []);

  const setRegion = useCallback((newRegion: AmazonRegion) => {
    setRegionState(newRegion);
    localStorage.setItem(STORAGE_KEY, newRegion);
  }, []);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return ctx;
}
