"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { throttle } from "../utils/throttle"

export interface RatingProps {
  name: string
  label?: string
  maxStars?: number
  value?: number
  disabled?: boolean
  onChange?: (rating: number) => void
  className?: string
  helperText?: string
}

export const Rating: React.FC<RatingProps> = ({
  name,
  label,
  maxStars = 5,
  value = 0,
  disabled = false,
  onChange,
  className = "",
  helperText,
}) => {
  const [rating, setRating] = useState(value)
  const [hoverRating, setHoverRating] = useState(0)
  const { validateField } = useFieldValidation(name)

  const throttledChange = useCallback(
    throttle((newRating: number) => {
      validateField("")
      onChange?.(newRating)
    }, 100),
    [onChange, validateField],
  )

  const handleClick = (star: number) => {
    if (!disabled) {
      setRating(star)
      throttledChange(star)
    }
  }

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
        <label
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {Array.from({ length: maxStars }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index + 1)}
            onMouseEnter={() => setHoverRating(index + 1)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: "24px",
              cursor: disabled ? "not-allowed" : "pointer",
              color: index < (hoverRating || rating) ? "#000000" : "#e5e7eb",
              transition: "color 0.2s ease, transform 0.2s ease",
              transform: index < (hoverRating || rating) ? "scale(1.1)" : "scale(1)",
              background: "none",
              border: "none",
              padding: 0,
            }}
            disabled={disabled}
            aria-label={`Rate ${index + 1} out of ${maxStars}`}
          >
            ★
          </button>
        ))}
      </div>
      {helperText && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
