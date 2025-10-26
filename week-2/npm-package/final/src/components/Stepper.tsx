"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { throttle } from "../utils/throttle"
import { getAnimationStyles } from "../styles/animations"
import { defaultTheme } from "../styles/theme"

export interface StepperProps {
  name: string
  label?: string
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange?: (value: number) => void
  theme?: typeof defaultTheme
  className?: string
  helperText?: string
}

export const Stepper: React.FC<StepperProps> = ({
  name,
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onChange,
  theme = defaultTheme,
  className = "",
  helperText,
}) => {
  const [count, setCount] = useState(value)
const { validateField, error: fieldError } = useFieldValidation(name, {
  type: "custom",
  customValidator: (val: string) => {
    const num = Number(val)
    if (isNaN(num)) return false
    if (num < min) return false
    if (num > max) return false
    return true
  },
  errorMessage: `Value must be between ${min} and ${max}`,
})

const throttledChange = useCallback(
  throttle((newCount: number) => {
    // Assuming validateField expects a number
    validateField(newCount.toString());
    if (onChange) {
      onChange(newCount);
    }
  }, 100),
  [validateField, onChange]
);


  const handleIncrement = () => {
    if (count < max) {
      const newCount = count + step
      setCount(newCount)
      throttledChange(newCount)
    }
  }

  const handleDecrement = () => {
    if (count > min) {
      const newCount = count - step
      setCount(newCount)
      throttledChange(newCount)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number.parseInt(e.target.value) || 0
    if (newCount >= min && newCount <= max) {
      setCount(newCount)
      throttledChange(newCount)
    }
  }

  const containerStyle: React.CSSProperties = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text.primary,
  }

  const stepperContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ...getAnimationStyles("slideIn"),
  }

  const buttonStyle = (isDisabled: boolean): React.CSSProperties => ({
    width: "40px",
    height: "40px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    backgroundColor: isDisabled ? theme.colors.disabled : theme.colors.background,
    color: theme.text.primary,
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  })

  const inputStyle: React.CSSProperties = {
    width: "60px",
    padding: "8px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.background,
    color: theme.text.primary,
    textAlign: "center",
    outline: "none",
  }

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={stepperContainerStyle}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || count <= min}
          style={buttonStyle(disabled || count <= min)}
        >
          −
        </button>
        <input
          type="number"
          name={name}
          value={count}
          onChange={handleInputChange}
          disabled={disabled}
          style={inputStyle}
          min={min}
          max={max}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || count >= max}
          style={buttonStyle(disabled || count >= max)}
        >
          +
        </button>
      </div>
      {helperText && <span style={{ fontSize: "12px", color: theme.text.secondary }}>{helperText}</span>}
    </div>
  )
}
