"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"
import { getAnimationStyles } from "../styles/animations"
import { defaultTheme } from "../styles/theme"

export interface URLFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  theme?: typeof defaultTheme
  className?: string
  helperText?: string
}

export const URLField: React.FC<URLFieldProps> = ({
  name,
  label,
  placeholder = "https://example.com",
  required = false,
  disabled = false,
  onChange,
  onBlur,
  theme = defaultTheme,
  className = "",
  helperText,
}) => {
  const [value, setValue] = useState<string>("")
  const [isFocused, setIsFocused] = useState(false)

  // Field validation setup
const { validateField, error } = useFieldValidation(name, {
  type: "url",
  customValidator: (val: string) => {
    if (!val) return !required // if required, return false for empty
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  },
  errorMessage: required ? "URL is required" : "Please enter a valid URL",
})



  // Debounced validation to avoid spamming validation on each keystroke
  const debouncedValidate = useCallback(
    debounce((val: string) => {
      validateField(val)
      onChange?.(val)
    }, 300),
    [validateField, onChange],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    debouncedValidate(val)
  }

  const containerStyle: React.CSSProperties = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "14px",
    border: `1px solid ${error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border}`,
    borderRadius: "6px",
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.background,
    color: theme.text.primary,
    transition: "all 0.2s ease",
    outline: "none",
    ...getAnimationStyles("slideIn"),
  }

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: theme.colors.error,
    animation: "slideIn 0.2s ease",
  }

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: theme.colors.error }}>*</span>}
        </label>
      )}
      <input
        type="url"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          validateField(value)  // validate on blur too
          onBlur?.()
        }}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
      />
      {error && <span style={errorStyle}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: "12px", color: theme.text.secondary }}>{helperText}</span>}
    </div>
  )
}
