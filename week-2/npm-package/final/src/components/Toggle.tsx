"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { throttle } from "../utils/throttle"

export interface ToggleProps {
  name: string
  label?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  helperText?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  name,
  label,
  checked = false,
  disabled = false,
  onChange,
  className = "",
  helperText,
}) => {
  const [isChecked, setIsChecked] = useState(checked)
  const { validateField } = useFieldValidation(name)

  const throttledChange = useCallback(
    throttle((newChecked: boolean) => {
      validateField("")
      onChange?.(newChecked)
    }, 200),
    [onChange, validateField],
  )

  const handleChange = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    throttledChange(newChecked)
  }

  return (
    <div
      style={{
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
      className={className}
    >
      <button
        type="button"
        name={name}
        onClick={handleChange}
        disabled={disabled}
        style={{
          position: "relative",
          width: "48px",
          height: "24px",
          backgroundColor: isChecked ? "#000000" : "#e5e7eb",
          borderRadius: "12px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
          border: "none",
          padding: 0,
        }}
        aria-pressed={isChecked}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: isChecked ? "26px" : "2px",
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            transition: "left 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </button>
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
            cursor: disabled ? "not-allowed" : "pointer",
            userSelect: "none",
          }}
        >
          {label}
        </label>
      )}
      {helperText && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
