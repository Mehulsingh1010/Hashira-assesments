"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

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
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  style?: React.CSSProperties
  containerStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
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
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  style,
  containerStyle,
  labelStyle,
  maxSelection,
}) => {
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
  const displayError = fieldTouched && fieldError

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

  // Build class names
  const selectClasses = [
    "form-multiselect-select",
    isFocused && "form-multiselect-focused",
    displayError && "form-multiselect-error",
    disabled && "form-multiselect-disabled",
    className
  ].filter(Boolean).join(" ")

  const labelClasses = [
    "form-label",
    isFocused && "focused",
    labelClassName
  ].filter(Boolean).join(" ")

  const arrowClasses = [
    "form-multiselect-arrow",
    isOpen && "form-multiselect-open"
  ].filter(Boolean).join(" ")

  return (
    <div
      ref={containerRef}
      className={`form-multiselect-container ${containerClassName}`}
      style={containerStyle}
    >
      {label && (
        <div className="form-label-wrapper">
          <label className={labelClasses} style={labelStyle}>
            {label}
          </label>
          {required && (
            <span className="form-required-badge" title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      <div className="form-multiselect-wrapper">
        <div
          className={selectClasses}
          style={style}
          onClick={handleToggleDropdown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggleDropdown()
            }
          }}
        >
          <span className={selectedValues.length === 0 ? "form-multiselect-placeholder" : "form-multiselect-selected-text"}>
            {selectedValues.length === 0 
              ? placeholder 
              : `${selectedValues.length} option${selectedValues.length > 1 ? 's' : ''} selected`
            }
          </span>
          <span className={arrowClasses}>▼</span>
        </div>

        {/* Status Icons */}
        {!isOpen && (
          <div className="form-icon-container">
            {isValid && (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`form-check-icon ${isValid ? 'visible' : ''}`}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            {displayError && !isValid && (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`form-error-icon ${displayError ? 'visible' : ''}`}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            )}
          </div>
        )}

        {isOpen && (
          <div className="form-multiselect-dropdown">
            {options.length === 0 ? (
              <div className="form-multiselect-option form-multiselect-no-options">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                const optionClasses = [
                  "form-multiselect-option",
                  isSelected && "form-multiselect-option-selected"
                ].filter(Boolean).join(" ")
                
                return (
                  <div
                    key={option.value}
                    className={optionClasses}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(option.value)
                    }}
                  >
                    <div className={`form-multiselect-checkbox ${isSelected ? 'form-multiselect-checkbox-checked' : ''}`}>
                      {isSelected && (
                        <svg className="form-multiselect-checkmark" viewBox="0 0 12 12" fill="none">
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
        <div className="form-multiselect-badges">
          {selectedValues.map((val) => {
            const option = options.find((o) => o.value === val)
            if (!option) return null
            
            return (
              <div key={val} className="form-multiselect-badge">
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="form-multiselect-badge-button"
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
        <div className={`form-error-text ${errorClassName}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{fieldError}</span>
        </div>
      )}
      
      {helperText && !displayError && (
        <span className="form-helper-text">{helperText}</span>
      )}
    </div>
  )
}