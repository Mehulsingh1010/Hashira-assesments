"use client"

import React, { useCallback, useRef, useState } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css" // Import global CSS

export interface ButtonProps {
  type?: "button" | "submit" | "reset"
  children?: React.ReactNode
  label?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "danger"
  fullWidth?: boolean
  size?: "small" | "medium" | "large"
  enableThrottle?: boolean
  throttleDelay?: number
  showErrorSummary?: boolean
  showSuccessModal?: boolean
  successMessage?: string
  onSuccess?: () => void
  submissionDelay?: number
  className?: string
  containerClassName?: string
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  label,
  onClick,
  disabled = false,
  loading: externalLoading = false,
  variant = "primary",
  fullWidth = false,
  size = "medium",
  enableThrottle,
  throttleDelay,
  showErrorSummary = true,
  showSuccessModal = true,
  successMessage = "Form submitted successfully!",
  onSuccess,
  submissionDelay = 2000,
  className = "",
  containerClassName = "",
}) => {
  const formContext = (() => {
    try {
      return useFormContext()
    } catch {
      return null
    }
  })()

  const isSubmitButton = type === "submit"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorSummary, setErrorSummary] = useState<string[]>([])
  const [showErrors, setShowErrors] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const shouldThrottle = enableThrottle ?? isSubmitButton
  const delay = throttleDelay ?? (isSubmitButton ? 1000 : 300)
  const lastClickTime = useRef(0)
  const isLoading = externalLoading || isSubmitting

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return

      // Throttling
      if (shouldThrottle) {
        const now = Date.now()
        if (now - lastClickTime.current < delay) {
          e.preventDefault()
          e.stopPropagation()
          console.log("⏱ Please wait before clicking again.")
          return
        }
        lastClickTime.current = now
      }

      if (isSubmitButton && formContext) {
        e.preventDefault()
        setShowErrors(false)
        setErrorSummary([])

        try {
          const isValid = await formContext.validateForm()
          if (!isValid) {
            if (showErrorSummary) {
              const errors = Object.entries(formContext.errors)
                .filter(([_, error]) => error)
                .map(([field, error]) => `${field}: ${error}`)
              setErrorSummary(errors)
              setShowErrors(true)
            }
            return
          }

          setIsSubmitting(true)
          await new Promise((r) => setTimeout(r, submissionDelay))
          await formContext.submitForm?.()
          setIsSubmitting(false)
          if (showSuccessModal) setShowSuccess(true)
          onSuccess?.()
        } catch (err) {
          console.error("Form submission error:", err)
          setIsSubmitting(false)
          setErrorSummary(["An unexpected error occurred during submission."])
          setShowErrors(true)
        }
      } else {
        onClick?.()
      }
    },
    [
      disabled,
      isLoading,
      shouldThrottle,
      delay,
      isSubmitButton,
      formContext,
      submissionDelay,
      showErrorSummary,
      showSuccessModal,
      onSuccess,
      onClick,
    ]
  )

  const buttonClasses = `
    form-button
    form-button-${variant}
    form-button-${size}
    ${fullWidth ? 'form-button-full-width' : ''}
    ${isLoading ? 'form-button-loading' : ''}
    ${disabled ? 'form-button-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={`form-button-container ${containerClassName}`}>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={buttonClasses}
      >
        {isLoading ? (
          <>
            <div className="form-button-spinner" />
            <span>Processing...</span>
          </>
        ) : (
          children || label
        )}
      </button>

      {/* Error Summary */}
      {showErrorSummary && showErrors && errorSummary.length > 0 && (
        <div className="form-button-error-summary">
          <strong>⚠️ Please fix the following errors:</strong>
          <ul>
            {errorSummary.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div 
          className="form-button-modal-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="form-button-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="form-button-modal-icon">
              <span>✓</span>
            </div>
            <h2 className="form-button-modal-title">Success!</h2>
            <p className="form-button-modal-message">{successMessage}</p>
            <button
              className="form-button form-button-primary form-button-medium"
              onClick={(e) => {
                e.stopPropagation()
                setTimeout(() => setShowSuccess(false), 150)
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}