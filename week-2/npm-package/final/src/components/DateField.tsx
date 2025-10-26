"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface DateFieldProps {
  name: string
  label?: string
  placeholder?: string
  min?: string
  max?: string
  minAge?: number
  maxAge?: number
  required?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  inputClassName?: string
  helperText?: string
  theme?: Partial<ThemeConfig>
}

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  placeholder = "Select a date",
  min,
  max,
  minAge,
  maxAge,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  inputClassName = "",
  helperText,
  theme: customTheme,
}) => {
  const formContext = useFormContext()
  const theme = { ...defaultTheme, ...customTheme }
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const value = formContext.values[name] || ""
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  const hasValue = value && value.length > 0
  const isValid = hasValue && !error && isTouched

  const calculateAge = (dateString: string): number => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const validateDateInternal = useCallback(async (): Promise<boolean> => {
    const currentValue = formContext.values[name] || ""
    let validationError = ""

    if (required && !currentValue) {
      validationError = "This field is required"
    } else if (currentValue) {
      const selectedDate = new Date(currentValue)
      
      if (min && selectedDate < new Date(min)) {
        validationError = `Date must be after ${min}`
      } else if (max && selectedDate > new Date(max)) {
        validationError = `Date must be before ${max}`
      } else if (minAge !== undefined) {
        const age = calculateAge(currentValue)
        if (age < minAge) {
          validationError = `You must be at least ${minAge} years old`
        }
      } else if (maxAge !== undefined) {
        const age = calculateAge(currentValue)
        if (age > maxAge) {
          validationError = `Age cannot exceed ${maxAge} years`
        }
      }
    }

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [name, required, min, max, minAge, maxAge, formContext])

  useEffect(() => {
    formContext.registerField(name, validateDateInternal)
    return () => {
      formContext.unregisterField(name)
    }
  }, [name, validateDateInternal, formContext])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    formContext.setFieldValue(name, val)
    onChange?.(val)
    
    if (isTouched && error) {
      formContext.setFieldError(name, "")
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    formContext.setFieldTouched(name, true)
    validateDateInternal()
    onBlur?.()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const baseStyles = {
    container: {
      marginBottom: theme.spacing,
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      width: "100%",
      position: "relative" as const,
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: isFocused ? theme.primaryColor : theme.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isFocused ? "translateY(-1px)" : "translateY(0)",
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${theme.errorColor}15`,
      color: theme.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: required ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
    },
    inputWrapper: {
      position: "relative" as const,
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${
        error && isTouched 
          ? theme.errorColor 
          : isFocused 
          ? theme.primaryColor 
          : isHovered
          ? "#a1a1aa"
          : theme.borderColor
      }`,
      borderRadius: "10px",
      backgroundColor: disabled ? "#fafafa" : theme.backgroundColor,
      color: theme.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box" as const,
      cursor: disabled ? "not-allowed" : "text",
      opacity: disabled ? 0.5 : 1,
      WebkitAppearance: "none" as const,
      MozAppearance: "none" as const,
      boxShadow: error && isTouched 
        ? `0 0 0 4px ${theme.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)`
        : isFocused 
        ? `0 0 0 4px ${theme.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)`
        : isHovered
        ? "0 2px 8px rgba(0,0,0,0.06)"
        : "0 2px 4px rgba(0,0,0,0.04)",
      transform: isFocused ? "translateY(-1px)" : "translateY(0)",
    },
    iconContainer: {
      position: "absolute" as const,
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none" as const,
    },
    checkIcon: {
      color: "#10b981",
      opacity: isValid ? 1 : 0,
      transform: isValid ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    errorIcon: {
      color: theme.errorColor,
      opacity: error && isTouched ? 1 : 0,
      transform: error && isTouched ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: error && isTouched ? "shake 0.5s ease-in-out" : "none",
    },
    errorText: {
      fontSize: "13px",
      color: theme.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease",
    },
  }

  const uniqueId = `date-field-${name}`

  return (
    <div style={baseStyles.container} className={containerClassName}>
      {label && (
        <div style={baseStyles.labelWrapper}>
          <label style={baseStyles.label} htmlFor={name} className={labelClassName}>
            {label}
          </label>
          {required && (
            <span style={baseStyles.requiredBadge} title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      <div style={baseStyles.inputWrapper}>
        <input
          id={name}
          type="date"
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          style={baseStyles.input}
          className={`${className} ${inputClassName} ${uniqueId}`}
        />

        {/* Status Icons */}
        <div style={baseStyles.iconContainer}>
          {isValid && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={baseStyles.checkIcon}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {error && isTouched && !isValid && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={baseStyles.errorIcon}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
        </div>
      </div>

      {error && isTouched && (
        <div id={`${name}-error`} role="alert" style={baseStyles.errorText} className={errorClassName}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {helperText && !(error && isTouched) && (
        <div style={baseStyles.helperText}>{helperText}</div>
      )}

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }

          /* Custom Calendar Picker Styles */
          .${uniqueId}::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
            filter: none;
            width: 20px;
            height: 20px;
            margin-right: -8px;
          }

          .${uniqueId}::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }

          .${uniqueId}::-webkit-datetime-edit-fields-wrapper {
            padding: 0;
          }

          .${uniqueId}::-webkit-datetime-edit-text {
            color: ${theme.textColor};
            padding: 0 2px;
          }

          .${uniqueId}::-webkit-datetime-edit-month-field,
          .${uniqueId}::-webkit-datetime-edit-day-field,
          .${uniqueId}::-webkit-datetime-edit-year-field {
            color: ${theme.textColor};
            padding: 2px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .${uniqueId}::-webkit-datetime-edit-month-field:focus,
          .${uniqueId}::-webkit-datetime-edit-day-field:focus,
          .${uniqueId}::-webkit-datetime-edit-year-field:focus {
            background-color: ${theme.primaryColor}15;
            color: ${theme.primaryColor};
            outline: none;
          }

          /* Calendar dropdown styling */
          .${uniqueId}::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23${theme.primaryColor?.replace('#', '')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }

          /* Firefox date picker */
          .${uniqueId}::-moz-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
          }

          .${uniqueId}::-moz-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  )
}