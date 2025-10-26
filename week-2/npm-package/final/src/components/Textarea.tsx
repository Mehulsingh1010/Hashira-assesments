"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { validate, type ValidationConfig } from "../utils/validators"
import { debounce } from "../utils/debounce"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface TextareaProps {
  name: string
  label?: string
  placeholder?: string
  validation?: ValidationConfig
  theme?: Partial<ThemeConfig>
  disabled?: boolean
  required?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  value?: string
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  placeholder,
  validation,
  theme: customTheme,
  disabled = false,
  required = false,
  onChange,
  onBlur,
  value: externalValue,
  rows = 4,
  maxLength,
  showCharCount = false,
}) => {
  const formContext = useFormContext()
  const theme = { ...defaultTheme, ...customTheme }
  const [localValue, setLocalValue] = useState(externalValue || "")
  const [isFocused, setIsFocused] = useState(false)

  const value = externalValue !== undefined ? externalValue : localValue
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  // Debounced validation
  const debouncedValidate = useMemo(
    () =>
      debounce((val: string) => {
        if (validation) {
          const result = validate(val, validation)
          if (!result.isValid) {
            formContext.setFieldError(name, result.error || "Invalid input")
          } else {
            formContext.setFieldError(name, "")
          }
        }
      }, 300),
    [name, validation, formContext],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (!maxLength || newValue.length <= maxLength) {
        setLocalValue(newValue)
        formContext.setFieldValue(name, newValue)
        onChange?.(newValue)
        debouncedValidate(newValue)
      }
    },
    [name, formContext, onChange, debouncedValidate, maxLength],
  )

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    formContext.setFieldTouched(name, true)
    onBlur?.()
  }, [name, formContext, onBlur])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const styles = {
    container: {
      marginBottom: theme.spacing,
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
    },
    label: {
      fontSize: "12px",
      fontWeight: 600,
      color: theme.textColor,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      fontSize: theme.fontSize,
      border: `1px solid ${error && isTouched ? theme.errorColor : theme.borderColor}`,
      borderRadius: theme.borderRadius,
      backgroundColor: disabled ? "#f3f4f6" : theme.backgroundColor,
      color: theme.textColor,
      transition: "all 0.2s ease-in-out",
      outline: "none",
      boxSizing: "border-box" as const,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontFamily: "inherit",
      resize: "vertical" as const,
    },
    textareaFocused: {
      borderColor: error && isTouched ? theme.errorColor : theme.primaryColor,
      boxShadow: `0 0 0 3px ${error && isTouched ? `${theme.errorColor}20` : `${theme.primaryColor}20`}`,
    },
    errorText: {
      fontSize: "12px",
      color: theme.errorColor,
      marginTop: "4px",
    },
    charCount: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
      textAlign: "right" as const,
    },
  }

  return (
    <div style={styles.container}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={{ color: theme.errorColor }}>*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        rows={rows}
        style={{
          ...styles.textarea,
          ...(isFocused ? styles.textareaFocused : {}),
        }}
      />
      {error && isTouched && <div style={styles.errorText}>{error}</div>}
      {showCharCount && maxLength && (
        <div style={styles.charCount}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  )
}
