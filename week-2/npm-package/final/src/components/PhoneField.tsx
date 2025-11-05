"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

export interface PhoneFieldProps {
  name: string
  label?: string
  placeholder?: string
  countryCode?: string
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

export const PhoneField: React.FC<PhoneFieldProps> = ({
  name,
  label,
  placeholder = "5550000000",
  countryCode = "+1",
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
 
  const [currentCountryCode, setCurrentCountryCode] = useState<string>(countryCode)
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get values from form context
  const fullValue = formContext.values[name] || ""
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]

  // Extract phone number without country code for display
  const phoneNumber = fullValue.replace(/^\+\d+\s*/, "")
  const hasValue = phoneNumber && phoneNumber.length > 0
  const isValid = hasValue && !error && isTouched

  // Phone validation function
  const validatePhoneInternal = useCallback(async (): Promise<boolean> => {
    const currentValue = formContext.values[name] || ""
    let validationError = ""

    // Check required
    if (required && !currentValue) {
      validationError = "This field is required"
    }
    // Validate phone format
    else if (currentValue) {
      const phoneDigits = currentValue.replace(/\D/g, "")
      // Require at least 10 digits for most phone numbers
      if (phoneDigits.length < 10) {
        validationError = "Phone number must be at least 10 digits"
      } else if (phoneDigits.length > 15) {
        validationError = "Phone number is too long"
      }
    }

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [name, required, formContext])

  // Register field validator
  useEffect(() => {
    formContext.registerField(name, validatePhoneInternal)
    return () => {
      formContext.unregisterField(name)
    }
  }, [name, validatePhoneInternal, formContext])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Allow only numbers and basic formatting characters
    const cleaned = input.replace(/[^\d\s\-()]/g, "")
    const fullPhone = `${currentCountryCode} ${cleaned}`
    
    // Update form context
    formContext.setFieldValue(name, fullPhone)
    onChange?.(fullPhone)

    // Clear error on change if touched
    if (isTouched && error) {
      formContext.setFieldError(name, "")
    }
  }

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let code = e.target.value
    
    // Ensure it starts with +
    if (!code) {
      code = "+"
    } else if (!code.startsWith("+")) {
      code = "+" + code
    }
    
    // Remove any non-digit characters except the leading +
    code = "+" + code.slice(1).replace(/\D/g, "")
    
    setCurrentCountryCode(code)
    
    // Update full phone value with new country code
    if (phoneNumber) {
      const fullPhone = `${code} ${phoneNumber}`
      formContext.setFieldValue(name, fullPhone)
      onChange?.(fullPhone)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    formContext.setFieldTouched(name, true)
    validatePhoneInternal()
    onBlur?.()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  // Build class names
  const inputWrapperClasses = [
    "form-phone-input-wrapper",
    isFocused && "form-phone-focused",
    error && isTouched && "form-phone-error",
    disabled && "form-phone-disabled"
  ].filter(Boolean).join(" ")

  const labelClasses = [
    "form-phone-label",
    isFocused && "form-phone-focused",
    labelClassName
  ].filter(Boolean).join(" ")

  return (
    <div className={`form-phone-container ${containerClassName}`}>
      {label && (
        <div className="form-phone-label-wrapper">
          <label className={labelClasses} htmlFor={name}>
            {label}
          </label>
          {required && (
            <span className="form-phone-required-badge" title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      <div
        className={inputWrapperClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type="text"
          value={currentCountryCode}
          onChange={handleCountryCodeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`form-phone-country-code ${inputClassName}`}
          placeholder="+1"
        />
        
        <input
          id={name}
          type="tel"
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          className={`form-phone-input ${className} ${inputClassName}`}
        />

        {/* Status Icons */}
        <div className="form-phone-icon-container">
          {/* Success checkmark */}
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
              className={`form-phone-check-icon ${isValid ? 'form-phone-visible' : ''}`}
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {/* Error icon */}
          {error && isTouched && !isValid && (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={`form-phone-error-icon ${error && isTouched ? 'form-phone-visible' : ''}`}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
        </div>
      </div>

      {error && isTouched && (
        <div 
          id={`${name}-error`} 
          role="alert" 
          className={`form-phone-error-text ${errorClassName}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {helperText && !(error && isTouched) && (
        <div className="form-phone-helper-text">{helperText}</div>
      )}
    </div>
  )
}