"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface OtpInputProps {
  name: string
  length?: number // Number of OTP boxes
  label?: string
  required?: boolean
  disabled?: boolean
  onComplete?: (otp: string) => void
  theme?: Partial<ThemeConfig>
  helperText?: string
  className?: string
  style?: React.CSSProperties
}

export const OtpInput: React.FC<OtpInputProps> = ({
  name,
  length = 6,
  label,
  required = false,
  disabled = false,
  onComplete,
  theme: customTheme,
  helperText,
  className,
  style: customStyle,
}) => {
  const theme = { ...defaultTheme, ...customTheme }

  // Try to use form context safely
  const formContext = (() => {
    try {
      return useFormContext()
    } catch {
      return null
    }
  })()

  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""))
  const [isTouched, setIsTouched] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const error = formContext?.errors?.[name]
  const touched = formContext?.touched?.[name]
  const displayError = (touched || isTouched) && error

  // Register with FormContext (for validation)
  const validateOtp = useCallback(async (): Promise<boolean> => {
    if (!formContext) return true
    const otp = otpValues.join("")
    let validationError = ""

    if (required && otp.length < length) {
      validationError = "Please enter complete OTP"
    }

    formContext.setFieldError(name, validationError)
    return !validationError
  }, [formContext, name, otpValues, required, length])

  useEffect(() => {
    if (!formContext) return
    formContext.registerField(name, validateOtp)
    return () => formContext.unregisterField(name)
  }, [formContext, name, validateOtp])

  // Sync OTP with form values
  useEffect(() => {
    if (formContext) {
      formContext.setFieldValue(name, otpValues.join(""))
    }
  }, [otpValues, formContext, name])

  const handleChange = (index: number, value: string) => {
    if (disabled) return
    if (!/^[0-9a-zA-Z]?$/.test(value)) return // single alphanumeric only

    const updated = [...otpValues]
    updated[index] = value
    setOtpValues(updated)
    setIsTouched(true)
    formContext?.setFieldTouched(name, true)
    formContext?.setFieldError(name, "")

    // Move to next box automatically
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }

    // Trigger onComplete when filled
    const otp = updated.join("")
    if (otp.length === length) {
      onComplete?.(otp)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").slice(0, length)
    const chars = pasted.split("")
    const updated = Array(length)
      .fill("")
      .map((_, i) => chars[i] ?? "")
    setOtpValues(updated)
    if (updated.join("").length === length) {
      onComplete?.(updated.join(""))
    }
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      marginBottom: theme.spacing,
      ...customStyle,
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: theme.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    required: { color: theme.errorColor },
    inputGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    box: {
      width: "42px",
      height: "48px",
      borderRadius: theme.borderRadius,
      border: `2px solid ${displayError ? theme.errorColor : theme.borderColor}`,
      textAlign: "center" as const,
      fontSize: "20px",
      fontWeight: 600,
      outline: "none",
      color: theme.textColor,
      transition: "all 0.2s ease",
      backgroundColor: disabled ? "#f3f4f6" : "#fff",
    },
    boxFocus: {
      borderColor: theme.primaryColor,
      boxShadow: `0 0 0 3px ${theme.primaryColor}25`,
    },
    errorText: {
      fontSize: "12px",
      color: theme.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280",
    },
  }

  return (
    <div style={styles.container} className={className}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}

      <div style={styles.inputGroup} onPaste={handlePaste}>
        {otpValues.map((val, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            ref={(el) => (inputsRef.current[i] = el)}
            // onFocus={(e) =>
            //   (e.currentTarget.style?.borderColor = theme.primaryColor)
            // }
            // onBlur={(e) =>
            //   (e.currentTarget.style?.borderColor = displayError
            //     ? theme.errorColor
            //     : theme.borderColor)
            // }
            style={styles.box}
          />
        ))}
      </div>

      {displayError && <span style={styles.errorText}>⚠️ {error}</span>}
      {helperText && !displayError && (
        <span style={styles.helperText}>{helperText}</span>
      )}
    </div>
  )
}
