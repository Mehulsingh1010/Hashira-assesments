"use client"

import React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css" // Import global CSS

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
}) => {
  const formContext = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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

  const strengthClass = useMemo(() => {
    if (passwordStrength <= 1) return "weak"
    if (passwordStrength === 2) return "fair"
    if (passwordStrength === 3) return "good"
    return "strong"
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

  const requirements = useMemo(() => [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(value) },
    { label: "Lowercase letter", met: /[a-z]/.test(value) },
    { label: "Number", met: /\d/.test(value) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
  ], [value])

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
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!(error && isTouched)}
          aria-describedby={error && isTouched ? `${name}-error` : undefined}
          className={`form-input password-input ${error && isTouched ? 'error' : ''} ${className} ${inputClassName}`}
        />

        {/* Status Icons */}
        <div className="form-icon-container password-icon">
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

        {/* Password Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="form-password-toggle"
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

      {/* Password Strength Meter */}
      {showStrengthMeter && value && (
        <div className="form-strength-meter">
          <div className="form-strength-bar-container">
            <div className="form-strength-segment">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`form-strength-segment-item ${index < passwordStrength ? 'active' : ''} ${index < passwordStrength ? strengthClass : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
            <div className={`form-strength-label ${strengthClass}`}>
              <span className="form-strength-emoji">{strengthEmoji}</span>
              {strengthLabel}
            </div>
          </div>

          {/* Requirements List */}
          {isFocused && (
            <div className="form-requirements">
              {requirements.map((req, index) => (
                <div key={index} className={`form-requirement-item ${req.met ? 'met' : ''}`}>
                  <span className={`form-requirement-icon ${req.met ? 'met' : ''}`}>
                    {req.met ? "✓" : "○"}
                  </span>
                  {req.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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