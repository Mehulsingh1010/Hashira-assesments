"use client"

import React, { useCallback, useRef, useState } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface ButtonProps {
  type?: "button" | "submit" | "reset"
  children?: React.ReactNode
  label?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "danger"
  theme?: Partial<ThemeConfig>
  fullWidth?: boolean
  size?: "small" | "medium" | "large"
  style?: React.CSSProperties
  enableThrottle?: boolean
  throttleDelay?: number
  showErrorSummary?: boolean
  showSuccessModal?: boolean
  successMessage?: string
  onSuccess?: () => void
  submissionDelay?: number
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  label,
  onClick,
  disabled = false,
  loading: externalLoading = false,
  variant = "primary",
  theme: customTheme,
  fullWidth = false,
  size = "medium",
  style: customStyle,
  enableThrottle,
  throttleDelay,
  showErrorSummary = true,
  showSuccessModal = true,
  successMessage = "Form submitted successfully!",
  onSuccess,
  submissionDelay = 2000,
}) => {
  const theme = { ...defaultTheme, ...customTheme }
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

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return

    // Throttling
    if (shouldThrottle) {
      const now = Date.now()
      if (now - lastClickTime.current < delay) {
        e.preventDefault()
        e.stopPropagation()
        console.log("⏳ Please wait before clicking again.")
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
  }, [
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
  ])

  const variantStyles = {
    primary: { backgroundColor: theme.primaryColor, color: "#fff" },
    secondary: { backgroundColor: "#f3f4f6", color: theme.textColor },
    danger: { backgroundColor: theme.errorColor, color: "#fff" },
  }[variant]

  const sizeStyles =
    size === "small"
      ? { padding: "6px 12px", fontSize: 12 }
      : size === "large"
      ? { padding: "14px 24px", fontSize: 16 }
      : { padding: "10px 16px", fontSize: 14 }

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || isLoading}
        style={{
          ...variantStyles,
          ...sizeStyles,
          width: fullWidth ? "100%" : "auto",
          border: "none",
          borderRadius: theme.borderRadius,
          cursor: disabled || isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled || isLoading ? 0.6 : 1,
          transition: "all 0.2s ease-in-out",
          ...customStyle,
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            <span>Processing...</span>
          </>
        ) : (
          children || label
        )}
      </button>

      {/* Error Summary */}
      {showErrorSummary && showErrors && errorSummary.length > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: theme.borderRadius,
            color: "#991b1b",
            fontSize: 13,
          }}
        >
          <strong>⚠️ Please fix the following errors:</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {errorSummary.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.25s ease",
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 12,
              textAlign: "center",
              animation: "scaleIn 0.3s ease-out",
              maxWidth: 400,
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: "#dcfce7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <span style={{ color: "#16a34a", fontSize: 32 }}>✓</span>
            </div>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>Success!</h2>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>{successMessage}</p>
            <button
              style={{
                padding: "10px 24px",
                border: "none",
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: theme.borderRadius,
                fontWeight: 600,
                cursor: "pointer",
              }}
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
    </>
  )
}
