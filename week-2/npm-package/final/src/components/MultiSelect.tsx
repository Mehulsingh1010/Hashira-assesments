"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface Option {
  value: string | number
  label: string
}

export interface MultiSelectProps {
  name: string
  label?: string
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  theme?: Partial<ThemeConfig>
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  style?: React.CSSProperties
  maxSelection?: number
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Select options",
  required = false,
  disabled = false,
  helperText,
  theme: customTheme,
  className,
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  style: customStyle,
  maxSelection,
}) => {
  const theme = { ...defaultTheme, ...customTheme }
  const { 
    values, 
    errors, 
    touched, 
    setFieldValue, 
    setFieldError, 
    setFieldTouched,
    registerField,
    unregisterField,
  } = useFormContext()

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fieldValue = values[name] || []
  const selectedValues = Array.isArray(fieldValue) ? fieldValue : []
  const fieldError = errors[name]
  const fieldTouched = touched[name]

  const hasValue = selectedValues.length > 0
  const isValid = hasValue && !fieldError && fieldTouched

  const validate = useCallback(async (): Promise<boolean> => {
    const value = values[name]
    const valueArray = Array.isArray(value) ? value : []
    let error = ""

    if (required && valueArray.length === 0) {
      error = "Please select at least one option"
    }

    if (maxSelection && valueArray.length > maxSelection) {
      error = `You can select a maximum of ${maxSelection} option${maxSelection > 1 ? 's' : ''}`
    }

    setFieldError(name, error)
    return !error
  }, [values, name, required, maxSelection, setFieldError])

  useEffect(() => {
    registerField(name, validate)
    return () => unregisterField(name)
  }, [name, registerField, unregisterField, validate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
        if (selectedValues.length > 0) {
          setFieldTouched(name, true)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [name, selectedValues.length, setFieldTouched])

  const handleToggle = useCallback((optionValue: string | number) => {
    if (disabled) return

    const isSelected = selectedValues.includes(optionValue)
    let newValues: (string | number)[]

    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== optionValue)
    } else {
      if (maxSelection && selectedValues.length >= maxSelection) {
        setFieldError(name, `You can only select up to ${maxSelection} option${maxSelection > 1 ? 's' : ''}`)
        return
      }
      newValues = [...selectedValues, optionValue]
    }

    setFieldValue(name, newValues)
    setFieldTouched(name, true)
    
    if (isSelected && fieldError) {
      setFieldError(name, "")
    }
  }, [name, selectedValues, disabled, maxSelection, setFieldValue, setFieldTouched, setFieldError, fieldError])

  const handleRemove = useCallback((val: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return

    const newValues = selectedValues.filter((v) => v !== val)
    setFieldValue(name, newValues)
    setFieldTouched(name, true)
    
    if (fieldError) {
      setFieldError(name, "")
    }
  }, [name, selectedValues, disabled, setFieldValue, setFieldTouched, setFieldError, fieldError])

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setIsFocused(!isOpen)
    }
  }, [disabled, isOpen])

  const displayError = fieldTouched && fieldError

  const baseStyles = {
    container: {
      marginBottom: theme.spacing,
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      width: "100%",
      position: "relative" as const,
      ...customStyle,
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
      padding: "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${
        displayError 
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
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box" as const,
      opacity: disabled ? 0.5 : 1,
      boxShadow: displayError 
        ? `0 0 0 4px ${theme.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)`
        : isFocused 
        ? `0 0 0 4px ${theme.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)`
        : isHovered
        ? "0 2px 8px rgba(0,0,0,0.06)"
        : "0 2px 4px rgba(0,0,0,0.04)",
      transform: isFocused ? "translateY(-1px)" : "translateY(0)",
    },
    placeholder: {
      color: "#9ca3af",
      fontSize: "15px",
    },
    selectedText: {
      color: theme.textColor,
      fontSize: "15px",
      fontWeight: 500,
    },
    arrow: {
      fontSize: "12px",
      color: isFocused ? theme.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
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
      opacity: displayError ? 1 : 0,
      transform: displayError ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: displayError ? "shake 0.5s ease-in-out" : "none",
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
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "15px",
      borderBottom: `1px solid ${theme.borderColor}20`,
    },
    customCheckbox: {
      width: "18px",
      height: "18px",
      borderRadius: "4px",
      border: `2px solid ${theme.primaryColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
    checkmark: {
      width: "10px",
      height: "10px",
      color: "#ffffff",
    },
    selectedBadges: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "8px",
      animation: "fadeIn 0.3s ease",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 12px",
      backgroundColor: `${theme.primaryColor}`,
      color: "#ffffff",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 500,
      animation: "badgeAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    badgeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      fontSize: "18px",
      padding: 0,
      lineHeight: 1,
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
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
    <div
      ref={containerRef}
      style={baseStyles.container}
      className={containerClassName}
    >
      {label && (
        <div style={baseStyles.labelWrapper}>
          <label style={baseStyles.label} className={labelClassName}>
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={disabled ? -1 : 0}
          className={className}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggleDropdown()
            }
          }}
        >
          <span style={selectedValues.length === 0 ? baseStyles.placeholder : baseStyles.selectedText}>
            {selectedValues.length === 0 
              ? placeholder 
              : `${selectedValues.length} option${selectedValues.length > 1 ? 's' : ''} selected`
            }
          </span>
          <span style={baseStyles.arrow}>▼</span>
        </div>

        {/* Status Icons */}
        {!isOpen && (
          <div style={baseStyles.iconContainer}>
            {isValid && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={baseStyles.checkIcon}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            {displayError && !isValid && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={baseStyles.errorIcon}>
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
                const isSelected = selectedValues.includes(option.value)
                return (
                  <div
                    key={option.value}
                    style={{
                      ...baseStyles.option,
                      backgroundColor: isSelected ? `${theme.primaryColor}08` : "transparent",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(option.value)
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? `${theme.primaryColor}15` : `${theme.primaryColor}05`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? `${theme.primaryColor}08` : "transparent"
                    }}
                  >
                    <div style={{
                      ...baseStyles.customCheckbox,
                      backgroundColor: isSelected ? theme.primaryColor : "transparent",
                    }}>
                      {isSelected && (
                        <svg style={baseStyles.checkmark} viewBox="0 0 12 12" fill="none">
                          <polyline points="2 6 5 9 10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div style={baseStyles.selectedBadges}>
          {selectedValues.map((val) => {
            const option = options.find((o) => o.value === val)
            if (!option) return null
            
            return (
              <div key={val} style={baseStyles.badge}>
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  style={baseStyles.badgeButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {displayError && (
        <div style={baseStyles.errorText} className={errorClassName}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{fieldError}</span>
        </div>
      )}
      {helperText && !displayError && (
        <span style={baseStyles.helperText}>{helperText}</span>
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

          @keyframes badgeAppear {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}