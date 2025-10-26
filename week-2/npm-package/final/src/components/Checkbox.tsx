"use client"

import React, { useCallback, useState } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface CheckboxProps {
  name: string
  label?: string
  value?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  theme?: Partial<ThemeConfig>
  required?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  value,
  checked: externalChecked,
  onChange,
  disabled = false,
  theme: customTheme,
  required = false,
}) => {
  const formContext = useFormContext()
  const theme = { ...defaultTheme, ...customTheme }

  const fieldValue = formContext.values[name]
  const checked = externalChecked !== undefined ? externalChecked : fieldValue
  const error = formContext.errors[name]
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      formContext.setFieldValue(name, newChecked)
      formContext.setFieldTouched(name, true)
      onChange?.(newChecked)
    },
    [name, formContext, onChange],
  )

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: theme.spacing,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "opacity 0.3s ease",
    },
    checkboxWrapper: {
      position: "relative" as const,
      width: "22px",
      height: "22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxBase: {
      appearance: "none" as const,
      WebkitAppearance: "none" as const,
      width: "22px",
      height: "22px",
      borderRadius: "6px",
      border: `2px solid ${
        error ? theme.errorColor : isFocused ? theme.primaryColor : theme.borderColor
      }`,
      backgroundColor: checked ? theme.primaryColor : theme.backgroundColor,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: isHovered
        ? `0 0 0 4px ${theme.primaryColor}15`
        : isFocused
        ? `0 0 0 4px ${theme.primaryColor}20`
        : "none",
      outline: "none",
      position: "relative" as const,
    },
    checkmark: {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: checked ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
      opacity: checked ? 1 : 0,
      color: theme.backgroundColor,
      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "none" as const,
    },
    label: {
      fontSize: theme.fontSize || "14px",
      color: theme.textColor,
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none" as const,
      fontWeight: 500,
      transition: "color 0.2s ease",
    },
    requiredMark: {
      color: theme.errorColor,
      marginLeft: "4px",
      fontWeight: 600,
    },
    errorText: {
      fontSize: "12px",
      color: theme.errorColor,
      marginTop: "4px",
      animation: "fadeIn 0.3s ease",
    },
  }

  return (
    <div>
      <div
        style={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.checkboxWrapper}>
          <input
            type="checkbox"
            name={name}
            id={name}
            value={value}
            checked={checked || false}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.checkboxBase}
          />
          <svg
            style={styles.checkmark}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <label htmlFor={name} style={styles.label}>
            {label}
            {required && <span style={styles.requiredMark}>*</span>}
          </label>
        )}
      </div>

      {error && <div style={styles.errorText}>{error}</div>}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input[type="checkbox"]:checked {
            animation: fillPulse 0.3s ease forwards;
          }
          @keyframes fillPulse {
            0% {
              box-shadow: 0 0 0 0 ${theme.primaryColor}40;
            }
            50% {
              box-shadow: 0 0 0 6px ${theme.primaryColor}20;
            }
            100% {
              box-shadow: 0 0 0 0 ${theme.primaryColor}00;
            }
          }
        `}
      </style>
    </div>
  )
}
