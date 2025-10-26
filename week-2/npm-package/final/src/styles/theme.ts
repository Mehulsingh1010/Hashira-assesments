/**
 * Default theme configuration
 */

import type { ThemeConfig } from "../types"

export const defaultTheme: ThemeConfig = {
  primaryColor: "#000000",
  errorColor: "#ef4444",
  successColor: "#22c55e",
  borderColor: "#e5e7eb",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontSize: "14px",
  borderRadius: "6px",
  spacing: "8px",
}

export const mergeTheme = (baseTheme: ThemeConfig, customTheme?: Partial<ThemeConfig>): ThemeConfig => {
  return {
    ...baseTheme,
    ...customTheme,
  }
}
