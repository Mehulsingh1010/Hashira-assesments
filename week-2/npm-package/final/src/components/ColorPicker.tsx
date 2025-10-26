"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"

export interface ColorPickerProps {
  name: string
  label?: string
  value?: string
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (color: string) => void
  onBlur?: () => void
  className?: string
  helperText?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  name,
  label,
  value = "#000000",
  required = false,
  disabled = false,
  error,
  onChange,
  onBlur,
  className = "",
  helperText,
}) => {
  const [color, setColor] = useState(value)
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
    setColor(val)
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
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="color"
          name={name}
          value={color}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          disabled={disabled}
          style={{
            width: "50px",
            height: "40px",
            border: `1px solid ${error ? "#ef4444" : isFocused ? "#000000" : "#e5e7eb"}`,
            borderRadius: "6px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
        <span style={{ fontSize: "14px", color: "#1f2937", fontFamily: "monospace" }}>{color}</span>
      </div>
      {error && <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
