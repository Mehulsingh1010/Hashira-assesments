"use client"

import React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface PasswordFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minStrength?: "weak" | "fair" | "good" | "strong" | "very-strong"
  showStrengthMeter?: boolean
  matchField?: string
  onChange?: (value: string) => void
  onValidation?: (isValid: boolean, error?: string) => void
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  inputClassName?: string
  helperText?: string
  theme?: Partial<ThemeConfig>
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  placeholder = "Enter password",
  required = false,
  disabled = false,
  minStrength,
  showStrengthMeter = false,
  matchField,
  onChange,
  onValidation,
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
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const value = formContext.values[name] || ""
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  const hasValue = value && value.length > 0
  const isValid = hasValue && !error && isTouched

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!value) return 0
    let strength = 0
    if (value.length >= 8) strength++
    if (/[A-Z]/.test(value)) strength++
    if (/[a-z]/.test(value)) strength++
    if (/\d/.test(value)) strength++
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) strength++
    return strength
  }, [value])

  const strengthLabel = useMemo(() => {
    if (passwordStrength === 0) return "Very Weak"
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    if (passwordStrength === 4) return "Strong"
    return "Very Strong"
  }, [passwordStrength])

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 1) return "#ef4444"
    if (passwordStrength === 2) return "#f59e0b"
    if (passwordStrength === 3) return "#eab308"
    return "#10b981"
  }, [passwordStrength])

  const strengthEmoji = useMemo(() => {
    if (passwordStrength <= 1) return "😟"
    if (passwordStrength === 2) return "😐"
    if (passwordStrength === 3) return "🙂"
    if (passwordStrength === 4) return "😊"
    return "🔐"
  }, [passwordStrength])

  const validatePasswordInternal = useCallback(async (): Promise<boolean> => {
    const currentValue = formContext.values[name] || ""
    let validationError = ""

    if (required && !currentValue) {
      validationError = "This field is required"
    } else if (minStrength && currentValue) {
      const minStrengthMap = { weak: 1, fair: 2, good: 3, strong: 4, "very-strong": 5 }
      
      let currentStrength = 0
      if (currentValue.length >= 8) currentStrength++
      if (/[A-Z]/.test(currentValue)) currentStrength++
      if (/[a-z]/.test(currentValue)) currentStrength++
      if (/\d/.test(currentValue)) currentStrength++
      if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(currentValue)) currentStrength++

      if (currentStrength < minStrengthMap[minStrength]) {
        validationError = `Password must be at least ${minStrength}`
      }
    }

    if (!validationError && matchField && currentValue) {
      const matchValue = formContext.values[matchField]
      if (matchValue && currentValue !== matchValue) {
        validationError = "Passwords do not match"
      }
    }

    formContext.setFieldError(name, validationError)
    onValidation?.(!validationError, validationError)
    return !validationError
  }, [name, required, minStrength, matchField, formContext, onValidation])

  useEffect(() => {
    formContext.registerField(name, validatePasswordInternal)
    return () => {
      formContext.unregisterField(name)
    }
  }, [name, validatePasswordInternal, formContext])

  useEffect(() => {
    if (matchField && isTouched) {
      const matchValue = formContext.values[matchField]
      if (value && matchValue !== undefined) {
        validatePasswordInternal()
      }
    }
  }, [matchField ? formContext.values[matchField] : null])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    formContext.setFieldValue(name, newValue)
    onChange?.(newValue)
    
    if (isTouched && error) {
      formContext.setFieldError(name, "")
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    formContext.setFieldTouched(name, true)
    validatePasswordInternal()
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
      padding: "13px 80px 13px 16px",
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
      right: "45px",
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
    toggleButton: {
      position: "absolute" as const,
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      color: isFocused ? theme.primaryColor : "#6b7280",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    strengthMeter: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    strengthBarContainer: {
      display: "flex",
      gap: "4px",
      alignItems: "center",
    },
    strengthBar: {
      flex: 1,
      height: "6px",
      backgroundColor: "#e5e7eb",
      borderRadius: "3px",
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    strengthSegment: {
      display: "flex",
      gap: "3px",
      flex: 1,
    },
    segment: (index: number, isActive: boolean) => ({
      flex: 1,
      height: "6px",
      backgroundColor: isActive ? strengthColor : "#e5e7eb",
      borderRadius: "3px",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: isActive ? "scaleY(1.2)" : "scaleY(1)",
      animation: isActive ? `segmentPulse 0.5s ease ${index * 0.1}s` : "none",
    }),
    strengthLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: strengthColor,
      fontWeight: 600,
      animation: "fadeIn 0.3s ease",
    },
    emoji: {
      fontSize: "16px",
      animation: "bounce 0.5s ease",
    },
    requirements: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
      fontSize: "12px",
      animation: "slideDown 0.3s ease",
    },
    requirement: (met: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: met ? "#10b981" : "#6b7280",
      transition: "all 0.3s ease",
      fontWeight: met ? 500 : 400,
    }),
    requirementIcon: (met: boolean) => ({
      fontSize: "12px",
      color: met ? "#10b981" : "#d1d5db",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: met ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-90deg)",
    }),
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

  const requirements = useMemo(() => [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(value) },
    { label: "Lowercase letter", met: /[a-z]/.test(value) },
    { label: "Number", met: /\d/.test(value) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
  ], [value])

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
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          style={baseStyles.input}
          className={`${className} ${inputClassName}`}
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

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={baseStyles.toggleButton}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1)"}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div style={baseStyles.strengthMeter}>
          <div style={baseStyles.strengthBarContainer}>
            <div style={baseStyles.strengthSegment}>
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  style={baseStyles.segment(index, index < passwordStrength)}
                />
              ))}
            </div>
            <div style={baseStyles.strengthLabel}>
              <span style={baseStyles.emoji}>{strengthEmoji}</span>
              {strengthLabel}
            </div>
          </div>

          {isFocused && (
            <div style={baseStyles.requirements}>
              {requirements.map((req, index) => (
                <div key={index} style={baseStyles.requirement(req.met)}>
                  <span style={baseStyles.requirementIcon(req.met)}>
                    {req.met ? "✓" : "○"}
                  </span>
                  {req.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }

          @keyframes segmentPulse {
            0% {
              transform: scaleY(1);
              opacity: 0.6;
            }
            50% {
              transform: scaleY(1.4);
              opacity: 1;
            }
            100% {
              transform: scaleY(1.2);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}