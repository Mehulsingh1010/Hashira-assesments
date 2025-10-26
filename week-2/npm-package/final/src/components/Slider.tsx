"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { throttle } from "../utils/throttle"

export interface SliderProps {
  name: string
  label?: string
  min?: number
  max?: number
  step?: number
  value?: number
  disabled?: boolean
  onChange?: (value: number) => void
  className?: string
  helperText?: string
  showValue?: boolean
}

export const Slider: React.FC<SliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  disabled = false,
  onChange,
  className = "",
  helperText,
  showValue = true,
}) => {
  const [sliderValue, setSliderValue] = useState(value)
  const { validateField } = useFieldValidation(name)

  const throttledChange = useCallback(
    throttle((newValue: number) => {
      validateField("")
      onChange?.(newValue)
    }, 100),
    [onChange, validateField],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value)
    setSliderValue(newValue)
    throttledChange(newValue)
  }

  const percentage = ((sliderValue - min) / (max - min)) * 100

  return (
    <div
      style={{
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
      className={className}
    >
      {label && (
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label}</span>
          {showValue && <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000" }}>{sliderValue}</span>}
        </div>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          disabled={disabled}
          style={
            {
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              background: `linear-gradient(to right, #000000 0%, #000000 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
              outline: "none",
              WebkitAppearance: "none",
              appearance: "none",
              cursor: disabled ? "not-allowed" : "pointer",
            } as React.CSSProperties
          }
        />
      </div>
      {helperText && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
