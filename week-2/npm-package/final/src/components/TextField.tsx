"use client"

import type React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { validate, type ValidationConfig } from "../utils/validators"
import { debounce } from "../utils/debounce"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"
  
export interface TextFieldProps {
  name: string
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "tel" | "url" | "number"
  validation?: ValidationConfig
  theme?: Partial<ThemeConfig>
  disabled?: boolean
  required?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  value?: string
  helperText?: string
  showError?: boolean
  className?: string
  inputClassName?: string
  labelClassName?: string
  errorClassName?: string
  containerClassName?: string
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  validation,
  theme: customTheme,
  disabled = false,
  required = false,
  onChange,
  onBlur,
  value: externalValue,
  helperText,
  showError = true,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  containerClassName = "",
}) => {
  const formContext = useFormContext()
  const theme = { ...defaultTheme, ...customTheme }
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const value = formContext.values[name] || ""
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  useEffect(() => {
    if (externalValue !== undefined && formContext.values[name] === undefined) {
      formContext.setFieldValue(name, externalValue)
    }
  }, [externalValue, name, formContext])

  const validateField = useCallback(
    (val: string) => {
      let validationError = ""

      if (required && (!val || val.trim() === "")) {
        validationError = "This field is required"
      } else if (validation && val) {
        const result = validate(val, validation)
        if (!result.isValid) {
          validationError = result.error || "Invalid input"
        }
      }

      formContext.setFieldError(name, validationError)
      return !validationError
    },
    [name, required, validation, formContext],
  )

  const debouncedValidate = useMemo(
    () =>
      debounce((val: string) => {
        if (formContext.touched[name]) {
          validateField(val)
        }
      }, 300),
    [name, validateField, formContext.touched],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      formContext.setFieldValue(name, newValue)
      onChange?.(newValue)

      if (isTouched && error) {
        formContext.setFieldError(name, "")
      }

      debouncedValidate(newValue)
    },
    [name, formContext, onChange, debouncedValidate, isTouched, error],
  )

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    formContext.setFieldTouched(name, true)
    validateField(value)
    onBlur?.()
  }, [name, formContext, onBlur, validateField, value])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const hasValue = value && value.length > 0
  const isValid = hasValue && !error && isTouched

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
    characterCount: {
      fontSize: "12px",
      color: isFocused ? theme.primaryColor : "#a1a1aa",
      textAlign: "right" as const,
      fontWeight: 500,
      transition: "color 0.2s ease",
    },
  }

  const maxLength = validation?.maxLength

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
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          style={baseStyles.input}
          className={`${className} ${inputClassName}`}
        />
        {/* Status Icons */}
        <div style={baseStyles.iconContainer}>
          {/* Success checkmark */}
          {isValid && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={baseStyles.checkIcon}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {/* Error icon */}
          {error && isTouched && !isValid && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={baseStyles.errorIcon}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
        </div>
      </div>
      
      {/* Character count for fields with maxLength */}
      {maxLength && isFocused && (
        <div style={baseStyles.characterCount}>
          {value.length} / {maxLength}
        </div>
      )}

      {showError && error && isTouched && (
        <div id={`${name}-error`} role="alert" style={baseStyles.errorText} className={errorClassName}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      {helperText && !(error && isTouched) && <div style={baseStyles.helperText}>{helperText}</div>}
      
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
        `}
      </style>
    </div>
  )
}