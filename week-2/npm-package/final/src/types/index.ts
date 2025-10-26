import type React from "react"
/**
 * Global type definitions for the form validator widget
 */

export interface FormFieldError {
  field: string
  message: string
}

export interface FormContextType {
  onSubmitSuccess: any
  values: FormValues
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isSubmitted: boolean
  setFieldValue: (field: string, value: any) => void
  setFieldError: (field: string, error: string) => void
  setFieldTouched: (field: string, isTouched: boolean) => void
  validateField: (field: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  submitForm: () => Promise<void>
  handleSubmit: (onSubmitCallback: (values: FormValues) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>
  registerField: (field: string, validator: () => Promise<boolean>) => void
  unregisterField: (field: string) => void
}

export interface FormValues {
  [key: string]: any
}

export interface ThemeConfig {
  [x: string]: any
  primaryColor?: string
  errorColor?: string
  successColor?: string
  borderColor?: string
  backgroundColor?: string
  textColor?: string
  fontSize?: string
  borderRadius?: string
  spacing?: string
}

export interface AnimationConfig {
  duration?: number
  easing?: string
  enabled?: boolean
}
