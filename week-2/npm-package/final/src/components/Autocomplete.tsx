"use client"

import type React from "react"
import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface AutocompleteOption {
  value: string | number
  label: string
}

export interface AutocompleteProps {
  name: string
  label?: string
  options: AutocompleteOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  theme?: Partial<ThemeConfig>
  className?: string
  style?: React.CSSProperties
  multiple?: boolean
  freeSolo?: boolean
  maxSelection?: number
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  label,
  options,
  placeholder = "Search...",
  required = false,
  disabled = false,
  helperText,
  theme: customTheme,
  className,
  style: customStyle,
  multiple = false,
  freeSolo = false,
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

  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fieldValue = values[name]
  const selectedValues = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : [])
    : fieldValue
  const fieldError = errors[name]
  const fieldTouched = touched[name]

  // Validation function
  const validate = useCallback(async (): Promise<boolean> => {
    const value = values[name]
    let error = ""

    if (required) {
      if (multiple) {
        const valueArray = Array.isArray(value) ? value : []
        if (valueArray.length === 0) {
          error = "Please select at least one option"
        }
      } else {
        if (!value || value === "") {
          error = "This field is required"
        }
      }
    }

    if (multiple && maxSelection) {
      const valueArray = Array.isArray(value) ? value : []
      if (valueArray.length > maxSelection) {
        error = `You can select a maximum of ${maxSelection} option${maxSelection > 1 ? 's' : ''}`
      }
    }

    setFieldError(name, error)
    return !error
  }, [values, name, required, multiple, maxSelection, setFieldError])

  // Register field with form context
  useEffect(() => {
    registerField(name, validate)
    return () => unregisterField(name)
  }, [name, registerField, unregisterField, validate])

  // Filter options based on input and remove already selected ones
  const filteredOptions = useMemo(() => {
    let filtered = options
    
    // Remove already selected options in multiple mode
    if (multiple && Array.isArray(selectedValues)) {
      filtered = options.filter(opt => !selectedValues.includes(opt.value))
    }
    
    // Filter by search input
    if (inputValue) {
      filtered = filtered.filter((opt) => 
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    }
    
    return filtered
  }, [inputValue, options, multiple, selectedValues])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
        
        // Handle free solo input on blur
        if (freeSolo && inputValue && !multiple) {
          setFieldValue(name, inputValue)
        }
        
        setFieldTouched(name, true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [name, inputValue, freeSolo, multiple, setFieldValue, setFieldTouched])

  const handleSelect = useCallback((option: AutocompleteOption) => {
    if (disabled) return

    if (multiple) {
      const currentValues = Array.isArray(selectedValues) ? selectedValues : []

      // Check max selection
      if (maxSelection && currentValues.length >= maxSelection) {
        setFieldError(name, `You can only select up to ${maxSelection} option${maxSelection > 1 ? 's' : ''}`)
        return
      }

      const newValues = [...currentValues, option.value]
      setFieldValue(name, newValues)
      setInputValue("") // Clear input for next selection
      // Keep dropdown open for multiple selections
      setIsOpen(true)
    } else {
      setFieldValue(name, option.value)
      setInputValue(option.label)
      setIsOpen(false)
    }

    setFieldTouched(name, true)
    inputRef.current?.focus()
  }, [name, multiple, selectedValues, maxSelection, disabled, setFieldValue, setFieldTouched, setFieldError])

  const handleRemove = useCallback((value: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled || !multiple) return

    const currentValues = Array.isArray(selectedValues) ? selectedValues : []
    const newValues = currentValues.filter((v) => v !== value)
    setFieldValue(name, newValues)
    setFieldTouched(name, true)
    
    // Clear max selection error when removing
    if (fieldError) {
      setFieldError(name, "")
    }
  }, [name, multiple, selectedValues, disabled, setFieldValue, setFieldTouched, setFieldError, fieldError])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsOpen(true)

    // For non-multiple freeSolo, update value immediately
    if (freeSolo && !multiple) {
      setFieldValue(name, value)
    }
  }, [freeSolo, multiple, name, setFieldValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && freeSolo && inputValue && multiple) {
      e.preventDefault()
      const currentValues = Array.isArray(selectedValues) ? selectedValues : []
      
      // Check max selection
      if (maxSelection && currentValues.length >= maxSelection) {
        setFieldError(name, `You can only select up to ${maxSelection} option${maxSelection > 1 ? 's' : ''}`)
        return
      }

      // Add custom value
      if (!currentValues.includes(inputValue)) {
        setFieldValue(name, [...currentValues, inputValue])
        setInputValue("")
        setFieldTouched(name, true)
      }
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [freeSolo, inputValue, multiple, selectedValues, maxSelection, name, setFieldValue, setFieldTouched, setFieldError])

  const displayError = fieldTouched && fieldError

  // Get selected option labels for display
  const getSelectedLabels = useCallback(() => {
    if (multiple) {
      const currentValues = Array.isArray(selectedValues) ? selectedValues : []
      return currentValues.map(val => {
        const option = options.find(opt => opt.value === val)
        return option ? option.label : String(val)
      })
    } else {
      if (!selectedValues) return []
      const option = options.find(opt => opt.value === selectedValues)
      return option ? [option.label] : []
    }
  }, [multiple, selectedValues, options])

  const styles = {
    container: {
      marginBottom: theme.spacing,
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      position: "relative" as const,
      ...customStyle,
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: theme.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    required: {
      color: theme.errorColor,
    },
    inputWrapper: {
      position: "relative" as const,
    },
    input: {
      padding: "10px 12px",
      fontSize: "14px",
      border: `1px solid ${
        displayError ? theme.errorColor : 
        isFocused ? theme.focusColor : 
        theme.borderColor
      }`,
      borderRadius: theme.borderRadius,
      backgroundColor: disabled ? theme.disabledColor : "#ffffff",
      color: theme.textColor,
      transition: "all 0.2s ease",
      outline: "none",
      width: "100%",
      cursor: disabled ? "not-allowed" : "text",
    },
    dropdown: {
      position: "absolute" as const,
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `1px solid ${theme.borderColor}`,
      borderRadius: theme.borderRadius,
      marginTop: "4px",
      maxHeight: "240px",
      overflowY: "auto" as const,
      zIndex: 1000,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    option: {
      padding: "10px 12px",
      cursor: "pointer",
      color: theme.textColor,
      borderBottom: `1px solid ${theme.borderColor}`,
      transition: "background-color 0.2s ease",
    },
    noOptions: {
      padding: "10px 12px",
      color: "#6b7280",
      textAlign: "center" as const,
    },
    selectedBadges: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "6px",
      marginTop: "4px",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 10px",
      backgroundColor: theme.primaryColor,
      color: "#ffffff",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
    },
    badgeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      fontSize: "16px",
      padding: 0,
      lineHeight: 1,
      transition: "opacity 0.2s",
    },
    error: {
      fontSize: "12px",
      color: theme.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280",
    },
  }

  return (
    <div
      ref={containerRef}
      style={styles.container}
      className={className}
    >
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      
      <div style={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true)
            setIsOpen(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={styles.input}
          autoComplete="off"
        />

        {isOpen && filteredOptions.length > 0 && (
          <div style={styles.dropdown}>
            {filteredOptions.map((option) => {
              const isSelected = multiple && Array.isArray(selectedValues) && selectedValues.includes(option.value)
              return (
                <div
                  key={option.value}
                  style={{
                    ...styles.option,
                    backgroundColor: isSelected ? "#e0f2fe" : "transparent",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault() // Prevent input blur
                    handleSelect(option)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? "#bfdbfe" : "#f3f4f6"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? "#e0f2fe" : "transparent"
                  }}
                >
                  {multiple && (
                    <span style={{ marginRight: "8px" }}>
                      {isSelected ? "✓" : "○"}
                    </span>
                  )}
                  {option.label}
                </div>
              )
            })}
          </div>
        )}

        {isOpen && filteredOptions.length === 0 && inputValue && (
          <div style={styles.dropdown}>
            <div style={styles.noOptions}>
              {freeSolo 
                ? `Press Enter to add "${inputValue}"` 
                : "No options found"
              }
            </div>
          </div>
        )}
      </div>

      {/* Selected badges for multiple selection */}
      {multiple && Array.isArray(selectedValues) && selectedValues.length > 0 && (
        <div style={styles.selectedBadges}>
          {getSelectedLabels().map((label, index) => {
            const value = selectedValues[index]
            return (
              <div key={value} style={styles.badge}>
                {label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(value, e)}
                  style={styles.badgeButton}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
        <span style={styles.error}>
          ⚠️ {fieldError}
        </span>
      )}
      {helperText && !displayError && (
        <span style={styles.helperText}>{helperText}</span>
      )}
    </div>
  )
}