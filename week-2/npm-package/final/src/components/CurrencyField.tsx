"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"

export interface CurrencyFieldProps {
  name: string
  label?: string
  placeholder?: string
  currency?: string
  min?: number
  max?: number
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (value: number | null) => void
  onBlur?: () => void
  className?: string
  helperText?: string
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  name,
  label,
  placeholder = "0.00",
  currency = "USD",
  min,
  max,
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

  const { validateField } = useFieldValidation(name, {
    type: "custom",
    customValidator: (val: string) => {
      const numVal = val === "" ? null : Number.parseFloat(val)
      if (required && (numVal === null || isNaN(numVal))) return false
      if (numVal !== null) {
        if (min !== undefined && numVal < min) return false
        if (max !== undefined && numVal > max) return false
      }
      return true
    },
    errorMessage: required
      ? `Please enter a valid ${currency} amount between ${min?.toFixed(2)} and ${max?.toFixed(2)}`
      : `Amount must be between ${min?.toFixed(2)} and ${max?.toFixed(2)}`,
  })

  const formatCurrency = (val: string): string => {
    const numVal = val.replace(/[^\d.]/g, "")
    if (!numVal) return ""
    return Number.parseFloat(numVal).toFixed(2)
  }

  const debouncedValidate = useCallback(
    debounce((val: string) => {
      validateField(val)
      const numVal = val === "" ? null : Number.parseFloat(val)
      onChange?.(numVal)
    }, 300),
    [validateField, onChange]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setValue(formatted)
    debouncedValidate(formatted)
  }

  // Inject CSS dynamically
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      .currency-field {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        animation: fadeIn 0.2s ease-in;
      }
      .currency-label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .currency-required {
        color: #e63946;
      }
      .currency-input-container {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        background-color: #fff;
        transition: all 0.2s ease;
        overflow: hidden;
        animation: slideIn 0.2s ease;
      }
      .currency-input-container.focused {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
      }
      .currency-input-container.error {
        border-color: #e63946;
      }
      .currency-input-container.disabled {
        background-color: #f2f2f2;
        opacity: 0.7;
      }
      .currency-symbol {
        padding: 10px 12px;
        font-size: 14px;
        font-weight: 500;
        color: #555;
        border-right: 1px solid #ddd;
      }
      .currency-input {
        flex: 1;
        padding: 10px 12px;
        font-size: 14px;
        border: none;
        outline: none;
        color: #222;
        background: transparent;
      }
      .currency-input::placeholder {
        color: #aaa;
      }
      .currency-error-text {
        font-size: 12px;
        color: #e63946;
        animation: fadeIn 0.2s ease;
      }
      .currency-helper-text {
        font-size: 12px;
        color: #777;
      }
      @keyframes slideIn {
        from { transform: translateY(-3px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className={`currency-field ${className}`}>
      {label && (
        <label className="currency-label">
          {label}
          {required && <span className="currency-required">*</span>}
        </label>
      )}

      <div
        className={`currency-input-container 
          ${isFocused ? "focused" : ""} 
          ${error ? "error" : ""} 
          ${disabled ? "disabled" : ""}`}
      >
        <span className="currency-symbol">{currency}</span>
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
          className="currency-input"
        />
      </div>

      {error && <span className="currency-error-text">{error}</span>}
      {helperText && !error && (
        <span className="currency-helper-text">{helperText}</span>
      )}
    </div>
  )
}
