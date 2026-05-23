export type ThemeMode = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";

export const themeStorageKey = "cybersense.theme.mode";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "dark" || value === "light";
}

export function resolveThemeMode(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === "system") {
    return prefersDark ? "dark" : "light";
  }

  return mode;
}

export function buildThemeInitScript(defaultMode: ThemeMode = "system") {
  return `
    (() => {
      try {
        const storageKey = ${JSON.stringify(themeStorageKey)};
        const defaultMode = ${JSON.stringify(defaultMode)};
        const storedMode = window.localStorage.getItem(storageKey);
        const mode = storedMode === "system" || storedMode === "dark" || storedMode === "light"
          ? storedMode
          : defaultMode;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolvedTheme = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
        const root = document.documentElement;
        root.dataset.cybersenseThemeMode = mode;
        root.dataset.cybersenseTheme = resolvedTheme;
        root.style.colorScheme = resolvedTheme;
      } catch {
        // Ignore theme initialization failures and fall back to the CSS default.
      }
    })();
  `;
}
