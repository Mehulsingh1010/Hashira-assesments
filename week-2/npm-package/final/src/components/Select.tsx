"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

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

}) => {
  const formContext = useFormContext()

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

  // Build class names
  const selectBoxClasses = [
    "form-select-box",
    isFocused && "form-select-focused",
    error && isTouched && "form-select-error",
    disabled && "form-select-disabled",
    !value && "form-select-placeholder",
    isValid && !isOpen && "form-select-valid",
    className,
    inputClassName
  ].filter(Boolean).join(" ")

  const labelClasses = [
    "form-select-label",
    isFocused && "form-select-focused",
    labelClassName
  ].filter(Boolean).join(" ")

  const arrowClasses = [
    "form-select-arrow",
    isFocused && "form-select-focused",
    isOpen && "form-select-open"
  ].filter(Boolean).join(" ")

  return (
    <div 
      ref={containerRef} 
      className={`form-select-container ${containerClassName}`}
    >
      {label && (
        <div className="form-select-label-wrapper">
          <label className={labelClasses} htmlFor={name}>
            {label}
          </label>
          {required && (
            <span className="form-select-required-badge" title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      <div className="form-select-wrapper">
        <div
          className={selectBoxClasses}
          onClick={handleToggleDropdown}
          onBlur={handleBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggleDropdown()
            }
          }}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
        >
          <span>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={arrowClasses}>▼</span>
        </div>

        {/* Status Icons */}
        {!isOpen && (
          <div className="form-select-icon-container">
            {isValid && (
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`form-select-check-icon ${isValid ? 'form-select-visible' : ''}`}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            {error && isTouched && !isValid && (
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className={`form-select-error-icon ${error && isTouched ? 'form-select-visible' : ''}`}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            )}
          </div>
        )}

        {isOpen && (
          <div className="form-select-dropdown">
            {options.length === 0 ? (
              <div className="form-select-option form-select-no-options">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value === option.value
                return (
                  <div
                    key={option.value}
                    className={`form-select-option ${isSelected ? 'form-select-option-selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(option.value)
                    }}
                  >
                    {option.label}
                    {isSelected && (
                      <svg 
                        className="form-select-option-checkmark"
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
        <div 
          id={`${name}-error`} 
          role="alert" 
          className={`form-select-error-text ${errorClassName}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {helperText && !(error && isTouched) && (
        <div className="form-select-helper-text">{helperText}</div>
      )}
    </div>
  )
}