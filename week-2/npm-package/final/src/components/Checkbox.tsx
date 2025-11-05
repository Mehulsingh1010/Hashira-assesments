"use client"

import React, { useCallback, useState } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

export interface CheckboxProps {
  name: string
  label?: string
  value?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  value,
  checked: externalChecked,
  onChange,
  disabled = false,
  required = false,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
}) => {
  const formContext = useFormContext()

  const fieldValue = formContext.values[name]
  const checked = externalChecked !== undefined ? externalChecked : fieldValue
  const error = formContext.errors[name]
  const isTouched = formContext.touched[name]
  
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      formContext.setFieldValue(name, newChecked)
      formContext.setFieldTouched(name, true)
      onChange?.(newChecked)
    },
    [name, formContext, onChange]
  )

  const checkboxClasses = `
    form-checkbox-input
    ${checked ? 'form-checkbox-checked' : ''}
    ${error && isTouched ? 'form-checkbox-error' : ''}
    ${isFocused ? 'form-checkbox-focused' : ''}
    ${isHovered ? 'form-checkbox-hovered' : ''}
    ${disabled ? 'form-checkbox-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const containerClasses = `
    form-checkbox-container
    ${disabled ? 'form-checkbox-container-disabled' : ''}
    ${containerClassName}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className="form-checkbox-wrapper">
      <div
        className={containerClasses}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="form-checkbox-box-wrapper">
          <input
            type="checkbox"
            name={name}
            id={name}
            value={value}
            checked={checked || false}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={checkboxClasses}
            aria-invalid={!!(error && isTouched)}
            aria-describedby={error && isTouched ? `${name}-error` : undefined}
          />
          <svg
            className={`form-checkbox-checkmark ${checked ? 'form-checkbox-checkmark-visible' : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        {label && (
          <label 
            htmlFor={name} 
            className={`form-checkbox-label ${labelClassName}`}
          >
            {label}
            {required && (
              <span className="form-checkbox-required-mark">*</span>
            )}
          </label>
        )}
      </div>

      {/* Error Message */}
      {error && isTouched && (
        <div 
          id={`${name}-error`}
          role="alert"
          className={`form-checkbox-error-text ${errorClassName}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}