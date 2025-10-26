/**
 * Comprehensive validation functions for various field types
 */

export type ValidationRule = "email" | "phone" | "name" | "password" | "url" | "number" | "alphanumeric" | "custom"

export interface ValidationConfig {
  type: ValidationRule
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customValidator?: (value: string) => boolean
  errorMessage?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" }
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" }
  }
  return { isValid: true }
}

// Phone validation (supports multiple formats)
const phoneRegex = /^[\d\s\-+$$$$]{10,}$/
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" }
  }
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return { isValid: false, error: "Invalid phone number format" }
  }
  return { isValid: true }
}

// Name validation
const nameRegex = /^[a-zA-Z\s'-]{2,}$/
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: "Name is required" }
  }
  if (!nameRegex.test(name)) {
    return { isValid: false, error: "Name must contain only letters, spaces, hyphens, and apostrophes" }
  }
  return { isValid: true }
}

// Password validation with strength requirements
export interface PasswordConfig {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
}

export const validatePassword = (password: string, config: PasswordConfig = {}): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = config

  if (!password) {
    return { isValid: false, error: "Password is required" }
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` }
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" }
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" }
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" }
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one special character" }
  }

  return { isValid: true }
}

// URL validation
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: "URL is required" }
  }
  if (!urlRegex.test(url)) {
    return { isValid: false, error: "Invalid URL format" }
  }
  return { isValid: true }
}

// Number validation
export const validateNumber = (value: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: "Number is required" }
  }
  if (isNaN(Number(value))) {
    return { isValid: false, error: "Must be a valid number" }
  }
  return { isValid: true }
}

// Alphanumeric validation
const alphanumericRegex = /^[a-zA-Z0-9]+$/
export const validateAlphanumeric = (value: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: "This field is required" }
  }
  if (!alphanumericRegex.test(value)) {
    return { isValid: false, error: "Only letters and numbers are allowed" }
  }
  return { isValid: true }
}

// Length validation
export const validateLength = (value: string, minLength?: number, maxLength?: number): ValidationResult => {
  if (minLength && value.length < minLength) {
    return { isValid: false, error: `Minimum ${minLength} characters required` }
  }
  if (maxLength && value.length > maxLength) {
    return { isValid: false, error: `Maximum ${maxLength} characters allowed` }
  }
  return { isValid: true }
}

// Password match validation
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" }
  }
  return { isValid: true }
}

// Main validator function
export const validate = (value: string, config: ValidationConfig): ValidationResult => {
  // Check length first
  if (config.minLength || config.maxLength) {
    const lengthResult = validateLength(value, config.minLength, config.maxLength)
    if (!lengthResult.isValid) {
      return lengthResult
    }
  }

  // Check custom validator
  if (config.type === "custom" && config.customValidator) {
    const isValid = config.customValidator(value)
    return {
      isValid,
      error: isValid ? undefined : config.errorMessage || "Validation failed",
    }
  }

  // Check pattern
  if (config.pattern) {
    const isValid = config.pattern.test(value)
    return {
      isValid,
      error: isValid ? undefined : config.errorMessage || "Invalid format",
    }
  }

  // Type-based validation
  switch (config.type) {
    case "email":
      return validateEmail(value)
    case "phone":
      return validatePhone(value)
    case "name":
      return validateName(value)
    case "password":
      return validatePassword(value)
    case "url":
      return validateUrl(value)
    case "number":
      return validateNumber(value)
    case "alphanumeric":
      return validateAlphanumeric(value)
    default:
      return { isValid: true }
  }
}
