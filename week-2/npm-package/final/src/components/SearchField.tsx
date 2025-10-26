"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"
import { getAnimationStyles } from "../styles/animations"
import { defaultTheme } from "../styles/theme"

export interface SearchFieldProps {
  name: string
  label?: string
  placeholder?: string
  minChars?: number
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onBlur?: () => void
  theme?: typeof defaultTheme
  className?: string
  helperText?: string
}

export const SearchField: React.FC<SearchFieldProps> = ({
  name,
  label,
  placeholder = "Search...",
  minChars = 2,
  required = false,
  disabled = false,
  error,
  onChange,
  onSearch,
  onBlur,
  theme = defaultTheme,
  className = "",
  helperText,
}) => {
  const [value, setValue] = useState<string>("")
  const [isFocused, setIsFocused] = useState(false)
const { validateField, error: fieldError } = useFieldValidation(name, {
  type: "custom",
  customValidator: (val: string) => {
    if (required && !val.trim()) return false
    if (val.length < minChars) return false
    return true
  },
  errorMessage: required
    ? `Please enter at least ${minChars} characters`
    : `Minimum ${minChars} characters required`,
})
const debouncedSearch = useCallback(
  debounce((val: string) => {
    validateField(val)
    if (val.length >= minChars) {
      onSearch?.(val)
    }
    onChange?.(val)
  }, 300),
  [validateField, minChars, onSearch, onChange]
)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    debouncedSearch(val)
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

  const inputContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border}`,
    borderRadius: "6px",
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.background,
    transition: "all 0.2s ease",
    ...getAnimationStyles("slideIn"),
  }

  const searchIconStyle: React.CSSProperties = {
    padding: "10px 12px",
    color: theme.text.secondary,
    fontSize: "16px",
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "transparent",
    color: theme.text.primary,
    outline: "none",
  }

  const clearButtonStyle: React.CSSProperties = {
    padding: "10px 12px",
    background: "none",
    border: "none",
    color: theme.text.secondary,
    cursor: "pointer",
    fontSize: "16px",
    display: value ? "block" : "none",
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
      <div style={inputContainerStyle}>
        <span style={searchIconStyle}>🔍</span>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => {
            setValue("")
            onChange?.("")
          }}
          style={clearButtonStyle}
          disabled={disabled}
        >
          ✕
        </button>
      </div>
      {error && <span style={errorStyle}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: "12px", color: theme.text.secondary }}>{helperText}</span>}
    </div>
  )
}
