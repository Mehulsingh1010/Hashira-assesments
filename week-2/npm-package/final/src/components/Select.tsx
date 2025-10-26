"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  name: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  value?: string
  helperText?: string
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  inputClassName?: string
  theme?: Partial<ThemeConfig>
}

export const Select: React.FC<SelectProps> = ({
  name,
  options,
  label,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  required = false,
  value: externalValue,
  helperText,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  inputClassName = "",
  theme: customTheme,
}) => {
  const formContext = useFormContext()
  const theme = { ...defaultTheme, ...customTheme }
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const value = formContext.values[name] || ""
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  const hasValue = value && value.length > 0
  const isValid = hasValue && !error && isTouched

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    if (externalValue !== undefined && formContext.values[name] === undefined) {
      formContext.setFieldValue(name, externalValue)
    }
  }, [externalValue, name, formContext])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const validateSelectInternal = useCallback(async (): Promise<boolean> => {
    const currentValue = formContext.values[name] || ""
    let validationError = ""

    if (required && !currentValue) {
      validationError = "This field is required"
    }

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [name, required, formContext])

  useEffect(() => {
    formContext.registerField(name, validateSelectInternal)
    return () => {
      formContext.unregisterField(name)
    }
  }, [name, validateSelectInternal, formContext])

  const handleSelect = useCallback((optionValue: string) => {
    if (disabled) return
    
    formContext.setFieldValue(name, optionValue)
    onChange?.(optionValue)
    formContext.setFieldTouched(name, true)
    
    if (error) {
      formContext.setFieldError(name, "")
    }
    
    setIsOpen(false)
    setIsFocused(false)
  }, [name, formContext, onChange, error, disabled])

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setIsFocused(!isOpen)
    }
  }, [disabled, isOpen])

  const handleBlur = useCallback(() => {
    if (!isOpen) {
      setIsFocused(false)
      formContext.setFieldTouched(name, true)
      validateSelectInternal()
    }
  }, [name, formContext, validateSelectInternal, isOpen])

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
    selectWrapper: {
      position: "relative" as const,
      width: "100%",
    },
    select: {
      width: "100%",
      padding: isValid && !isOpen ? "13px 70px 13px 16px" : "13px 44px 13px 16px",
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
      color: value ? theme.textColor : "#9ca3af",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box" as const,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      boxShadow: error && isTouched 
        ? `0 0 0 4px ${theme.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)`
        : isFocused 
        ? `0 0 0 4px ${theme.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)`
        : isHovered
        ? "0 2px 8px rgba(0,0,0,0.06)"
        : "0 2px 4px rgba(0,0,0,0.04)",
      transform: isFocused ? "translateY(-1px)" : "translateY(0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    arrow: {
      fontSize: "12px",
      color: isFocused ? theme.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    },
    iconContainer: {
      position: "absolute" as const,
      right: "40px",
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
    dropdown: {
      position: "absolute" as const,
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `2px solid ${theme.primaryColor}`,
      borderRadius: "10px",
      maxHeight: "240px",
      overflowY: "auto" as const,
      zIndex: 1000,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      animation: "dropdownSlide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    option: {
      padding: "12px 16px",
      cursor: "pointer",
      color: theme.textColor,
      transition: "all 0.15s ease",
      fontSize: "15px",
      borderBottom: `1px solid ${theme.borderColor}20`,
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

  return (
    <div ref={containerRef} style={baseStyles.container} className={containerClassName}>
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
      
      <div style={baseStyles.selectWrapper}>
        <div
          style={baseStyles.select}
          onClick={handleToggleDropdown}
          onBlur={handleBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={disabled ? -1 : 0}
          className={`${className} ${inputClassName}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggleDropdown()
            }
          }}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
        >
          <span style={value ? undefined : { color: "#9ca3af" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span style={baseStyles.arrow}>▼</span>
        </div>

        {/* Status Icons */}
        {!isOpen && (
          <div style={baseStyles.iconContainer}>
            {isValid && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={baseStyles.checkIcon}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            {error && isTouched && !isValid && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={baseStyles.errorIcon}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            )}
          </div>
        )}

        {isOpen && (
          <div style={baseStyles.dropdown}>
            {options.length === 0 ? (
              <div style={{ ...baseStyles.option, cursor: "default", opacity: 0.6 }}>
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value === option.value
                return (
                  <div
                    key={option.value}
                    style={{
                      ...baseStyles.option,
                      backgroundColor: isSelected ? `${theme.primaryColor}08` : "transparent",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(option.value)
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? `${theme.primaryColor}15` : `${theme.primaryColor}05`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? `${theme.primaryColor}08` : "transparent"
                    }}
                  >
                    {option.label}
                    {isSelected && (
                      <svg 
                        style={{ 
                          marginLeft: "auto", 
                          display: "inline-block",
                          verticalAlign: "middle",
                          color: theme.primaryColor
                        }} 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
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

          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}