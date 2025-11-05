"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"
export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioProps {
  name: string
  options: RadioOption[]
  label?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  direction?: "horizontal" | "vertical"
  helperText?: string
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  style?: React.CSSProperties
  containerStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  onChange,
  disabled = false,
  required = false,
  direction = "vertical",
  helperText,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  style,
  containerStyle,
  labelStyle,
}) => {
  // Try using FormContext safely
  const formContext = (() => {
    try {
      return useFormContext()
    } catch {
      return null
    }
  })()

  // Local fallback for standalone use
  const [localValue, setLocalValue] = useState<string>("")
  const selectedValue = formContext?.values?.[name] ?? localValue
  const error = formContext?.errors?.[name]
  const touched = formContext?.touched?.[name]
  const [isTouched, setIsTouched] = useState(false)

  const displayError = error && (touched || isTouched)

  // Validation
  const validateRadioInternal = useCallback(async (): Promise<boolean> => {
    if (!formContext) return true
    const currentValue = formContext.values[name]
    let validationError = ""

    if (required && !currentValue) validationError = "This field is required"

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [formContext, name, required])

  // Register with form context
  useEffect(() => {
    if (!formContext) return
    formContext.registerField(name, validateRadioInternal)
    return () => formContext.unregisterField(name)
  }, [formContext, name, validateRadioInternal])

  const handleChange = useCallback(
    (value: string) => {
      if (formContext) {
        formContext.setFieldValue(name, value)
        formContext.setFieldTouched(name, true)
      } else {
        setLocalValue(value)
      }
      setIsTouched(true)
      onChange?.(value)
      if (formContext?.touched?.[name] && formContext?.errors?.[name]) {
        formContext.setFieldError(name, "")
      }
    },
    [formContext, name, onChange],
  )

  // Build class names
  const radioGroupClasses = [
    "form-radio-group",
    direction === "vertical" ? "form-radio-group-vertical" : "form-radio-group-horizontal",
    displayError && "form-radio-error",
    className
  ].filter(Boolean).join(" ")

  const labelClasses = [
    "form-label",
    labelClassName
  ].filter(Boolean).join(" ")

  return (
    <div
      className={`form-radio-container ${containerClassName}`}
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

      <div
        role="radiogroup"
        aria-label={label}
        aria-required={required}
        aria-invalid={!!displayError}
        className={radioGroupClasses}
        style={style}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const isDisabled = disabled || option.disabled

          const optionClasses = [
            "form-radio-option",
            isDisabled && "form-radio-disabled"
          ].filter(Boolean).join(" ")

          const circleClasses = [
            "form-radio-circle",
            isSelected && "form-radio-selected"
          ].filter(Boolean).join(" ")

          const dotClasses = [
            "form-radio-dot",
            isSelected && "form-radio-selected"
          ].filter(Boolean).join(" ")

          return (
            <label
              key={option.value}
              htmlFor={`${name}-${option.value}`}
              className={optionClasses}
            >
              <div className={circleClasses}>
                <div className={dotClasses} />
              </div>
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => !isDisabled && handleChange(option.value)}
                className="form-radio-input"
              />
              <span className="form-radio-text">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>

      {displayError && (
        <div role="alert" className={`form-error-text ${errorClassName}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {helperText && !displayError && (
        <span className="form-helper-text">{helperText}</span>
      )}
    </div>
  )
}