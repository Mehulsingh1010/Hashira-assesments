"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"

export interface TimeFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
  helperText?: string
}

export const TimeField: React.FC<TimeFieldProps> = ({
  name,
  label,
  placeholder = "Select a time",
  required = false,
  disabled = false,
  error,
  onChange,
  onBlur,
  className = "",
  helperText,
}) => {
  const [value, setValue] = useState<string>("")
  const [isFocused, setIsFocused] = useState(false)
  const { validateField } = useFieldValidation(name)

  const debouncedValidate = useCallback(
    debounce((val: string) => {
      validateField(val)
      onChange?.(val)
    }, 300),
    [onChange, validateField],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    debouncedValidate(val)
  }

  return (
    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }} className={className}>
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {label}
          {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <input
        type="time"
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
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${error ? "#ef4444" : isFocused ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
        }}
      />
      {error && <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
