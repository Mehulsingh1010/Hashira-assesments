"use client"

import type React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { validate, type ValidationConfig } from "../utils/validators"
import { debounce } from "../utils/debounce"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

export interface TextFieldProps {
  name: string
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "tel" | "url" | "number"
  validation?: ValidationConfig
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
  const [isFocused, setIsFocused] = useState(false)

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
  const maxLength = validation?.maxLength

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
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          className={`form-input ${error && isTouched ? 'error' : ''} ${className} ${inputClassName}`}
        />
        
        {/* Status Icons */}
        <div className="form-icon-container">
          {/* Success Checkmark */}
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
          
          {/* Error Icon */}
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
      
      {/* Character Count */}
      {maxLength && isFocused && (
        <div className={`form-character-count ${isFocused ? 'focused' : ''}`}>
          {value.length} / {maxLength}
        </div>
      )}

      {/* Error Message */}
      {showError && error && isTouched && (
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