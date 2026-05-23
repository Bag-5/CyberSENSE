"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  isThemeMode,
  resolveThemeMode,
  themeStorageKey,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPreference() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
}: {
  children: ReactNode;
  defaultMode?: ThemeMode;
}) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return defaultMode;
    }

    const storedMode = window.localStorage.getItem(themeStorageKey);
    return isThemeMode(storedMode) ? storedMode : defaultMode;
  });
  const [prefersDark, setPrefersDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setPrefersDark(mediaQuery.matches);
    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const resolvedTheme = resolveThemeMode(mode, prefersDark);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.cybersenseThemeMode = mode;
    root.dataset.cybersenseTheme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    window.localStorage.setItem(themeStorageKey, mode);

    const themeColor =
      resolvedTheme === "dark"
        ? "#050816"
        : getSystemPreference()
          ? "#eff6ff"
          : "#f8fafc";

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", themeColor);
    }
  }, [mode, resolvedTheme]);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setThemeMode: setMode,
    }),
    [mode, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider.");
  }

  return context;
}
