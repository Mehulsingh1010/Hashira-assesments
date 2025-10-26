"use client"

import React from "react"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface FormGroupProps {
  children: React.ReactNode
  title?: string
  description?: string
  theme?: Partial<ThemeConfig>
  spacing?: "compact" | "normal" | "relaxed"
  highlight?: boolean
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  title,
  description,
  theme: customTheme,
  spacing = "normal",
  highlight = false,
}) => {
  const theme = { ...defaultTheme, ...customTheme }

  const spacingMap = {
    compact: "10px",
    normal: "16px",
    relaxed: "24px",
  }

  const styles = {
    container: {
      marginBottom: spacingMap[spacing],
      padding: "18px 20px",
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.borderColor}`,
      backgroundColor: "#ffffff",
      boxShadow: highlight
        ? `0 0 0 4px ${theme.primaryColor}10, 0 1px 6px rgba(0,0,0,0.05)`
        : "0 1px 4px rgba(0,0,0,0.03)",
      transition: "all 0.25s ease",
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    header: {
      marginBottom: description ? "10px" : "6px",
    },
    title: {
      fontSize: "15px",
      fontWeight: 600,
      color: theme.textColor,
      marginBottom: description ? "4px" : "0",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    underline: {
      height: "2px",
      width: "40px",
      backgroundColor: theme.primaryColor,
      borderRadius: "2px",
      marginTop: "6px",
      opacity: highlight ? 1 : 0.6,
      transition: "opacity 0.25s ease",
    },
    description: {
      fontSize: "13px",
      color: "#6b7280",
      lineHeight: 1.5,
    },
    content: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
      animation: "fadeInGroup 0.3s ease",
    },
  }

  return (
    <div
      style={styles.container}
      onMouseEnter={(e) => {
        (e.currentTarget.style.boxShadow = `0 0 0 4px ${theme.primaryColor}15, 0 2px 8px rgba(0,0,0,0.06)`)
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.boxShadow = highlight
          ? `0 0 0 4px ${theme.primaryColor}10, 0 1px 6px rgba(0,0,0,0.05)`
          : "0 1px 4px rgba(0,0,0,0.03)")
      }}
    >
      {(title || description) && (
        <div style={styles.header}>
          {title && <div style={styles.title}>{title}</div>}
          {description && <div style={styles.description}>{description}</div>}
          {title && <div style={styles.underline}></div>}
        </div>
      )}

      <div style={styles.content}>{children}</div>

      <style>
        {`
          @keyframes fadeInGroup {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}
