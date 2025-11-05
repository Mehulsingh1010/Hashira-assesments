"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

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
}) => {
  const formContext = useFormContext()
  const [isFocused, setIsFocused] = useState(false)

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

  const inputClasses = `
    form-input
    form-date-input
    ${error && isTouched ? 'error' : ''}
    ${className}
    ${inputClassName}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={`form-field-container ${containerClassName}`}>
      {/* Label */}
      {label && (
        <div className="form-label-wrapper">
          <label 
            className={`form-label ${isFocused ? 'focused' : ''} ${labelClassName}`}
            htmlFor={name}
          >
            {label}
          </label>
          {required && (
            <span className="form-required-badge" title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      {/* Input Field */}
      <div className="form-input-wrapper">
        <input
          id={name}
          type="date"
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          className={inputClasses}
        />

        {/* Status Icons */}
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
          {error && isTouched && !isValid && (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={`form-error-icon ${error && isTouched && !isValid ? 'visible' : ''}`}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && isTouched && (
        <div 
          id={`${name}-error`} 
          role="alert" 
          className={`form-error-text ${errorClassName}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !(error && isTouched) && (
        <div className="form-helper-text">{helperText}</div>
      )}
    </div>
  )
}