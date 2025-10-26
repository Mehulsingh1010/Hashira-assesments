"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioProps {
  name: string
  options: RadioOption[]
  label?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  direction?: "horizontal" | "vertical"
  helperText?: string
  theme?: Partial<ThemeConfig>
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  onChange,
  disabled = false,
  required = false,
  direction = "vertical",
  helperText,
  theme: customTheme,
}) => {
  const theme = { ...defaultTheme, ...customTheme }

  // Try using FormContext safely
  const formContext = (() => {
    try {
      return useFormContext()
    } catch {
      return null
    }
  })()

  // Local fallback for standalone use
  const [localValue, setLocalValue] = useState<string>("")
  const selectedValue = formContext?.values?.[name] ?? localValue
  const error = formContext?.errors?.[name]
  const touched = formContext?.touched?.[name]
  const [isTouched, setIsTouched] = useState(false)

  // Validation
  const validateRadioInternal = useCallback(async (): Promise<boolean> => {
    if (!formContext) return true
    const currentValue = formContext.values[name]
    let validationError = ""

    if (required && !currentValue) validationError = "This field is required"

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [formContext, name, required])

  // Register with form context
  useEffect(() => {
    if (!formContext) return
    formContext.registerField(name, validateRadioInternal)
    return () => formContext.unregisterField(name)
  }, [formContext, name, validateRadioInternal])

  const handleChange = useCallback(
    (value: string) => {
      if (formContext) {
        formContext.setFieldValue(name, value)
        formContext.setFieldTouched(name, true)
      } else {
        setLocalValue(value)
      }
      setIsTouched(true)
      onChange?.(value)
      if (formContext?.touched?.[name] && formContext?.errors?.[name]) {
        formContext.setFieldError(name, "")
      }
    },
    [formContext, name, onChange],
  )

  return (
    <div
      style={{
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: theme.textColor,
          }}
        >
          {label}
          {required && <span style={{ color: theme.errorColor }}> *</span>}
        </label>
      )}

      <div
        role="radiogroup"
        aria-label={label}
        aria-required={required}
        aria-invalid={!!(error && (touched || isTouched))}
        style={{
          display: "flex",
          flexDirection: direction === "vertical" ? "column" : "row",
          gap: direction === "vertical" ? "10px" : "24px",
        }}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const isDisabled = disabled || option.disabled

          return (
            <label
              key={option.value}
              htmlFor={`${name}-${option.value}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
                userSelect: "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${
                    isSelected ? theme.primaryColor : "#d1d5db"
                  }`,
                  backgroundColor: "#fff",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected
                    ? `0 0 0 3px ${theme.primaryColor}25`
                    : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${
                      isSelected ? 1 : 0
                    })`,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: theme.primaryColor,
                    transition:
                      "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => !isDisabled && handleChange(option.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: theme.textColor,
                  transition: "color 0.2s ease",
                }}
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>

      {error && (touched || isTouched) && (
        <div role="alert" style={{ fontSize: "12px", color: theme.errorColor }}>
          {error}
        </div>
      )}

      {helperText && !(error && (touched || isTouched)) && (
        <div style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</div>
      )}
    </div>
  )
}



