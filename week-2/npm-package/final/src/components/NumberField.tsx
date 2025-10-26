"use client"

import type React from "react"
import { useState, useCallback } from "react"

export interface NumberFieldProps {
  name: string
  label?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (value: number | null) => void
  onBlur?: () => void
  className?: string
  helperText?: string
}

export const NumberField: React.FC<NumberFieldProps> = ({
  name,
  label,
  placeholder = "Enter a number",
  min,
  max,
  step = 1,
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
  const [localError, setLocalError] = useState<string>("")

  const validateAndUpdate = useCallback(
    (val: string) => {
      const numVal = val === "" ? null : parseFloat(val)
      
      if (numVal !== null) {
        if (min !== undefined && numVal < min) {
          setLocalError(`Must be at least ${min}`)
          return
        }
        if (max !== undefined && numVal > max) {
          setLocalError(`Must be at most ${max}`)
          return
        }
      }
      
      setLocalError("")
      onChange?.(numVal)
    },
    [min, max, onChange],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    
    // Allow empty string, negative sign, or valid numbers
    if (val === "" || val === "-" || !isNaN(parseFloat(val))) {
      setValue(val)
      validateAndUpdate(val)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Clean up value on blur
    if (value === "-") {
      setValue("")
      setLocalError("")
    }
    onBlur?.()
  }

  const displayError = error || localError

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
        type="number"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${displayError ? "#ef4444" : isFocused ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {displayError && <span style={{ fontSize: "12px", color: "#ef4444" }}>{displayError}</span>}
      {helperText && !displayError && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}