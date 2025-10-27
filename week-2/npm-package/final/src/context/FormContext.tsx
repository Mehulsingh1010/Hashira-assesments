"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useRef } from "react"
import type { FormContextType, FormValues } from "../types"

const FormContext = createContext<FormContextType | undefined>(undefined)

export interface FormProviderProps {
  children: React.ReactNode
  onSubmit?: (values: FormValues) => Promise<void> | void
  initialValues?: FormValues
  /** Define which fields are required */
  requiredFields?: string[]
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  onSubmit,
  initialValues = {},
  requiredFields = [],
}) => {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const fieldValidatorsRef = useRef<Record<string, () => Promise<boolean>>>({})
  
  const onSubmitSuccessRef = useRef<(() => void) | null>(null)

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => {
      if (error === "") {
        // Remove error if empty string
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return { ...prev, [field]: error }
    })
  }, [])

  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }))
  }, [])

  const registerField = useCallback((field: string, validator: () => Promise<boolean>) => {
    fieldValidatorsRef.current[field] = validator
  }, [])

  const unregisterField = useCallback((field: string) => {
    delete fieldValidatorsRef.current[field]
  }, [])

  const validateField = useCallback(
    async (field: string): Promise<boolean> => {
      const validator = fieldValidatorsRef.current[field]
      if (validator) {
        return await validator()
      }

      const value = values[field]
      let error = ""

      if (requiredFields.includes(field)) {
        if (value === "" || value === undefined || value === null) {
          error = "This field is required"
        } else if (typeof value === "string" && value.trim() === "") {
          error = "This field is required"
        } else if (Array.isArray(value) && value.length === 0) {
          error = "This field is required"
        } else if (typeof value === "boolean" && value === false && field === "terms") {
          error = "You must accept the terms and conditions"
        }
      }

      if (error) {
        setFieldError(field, error)
        return false
      } else {
        setFieldError(field, "")
        return true
      }
    },
    [values, requiredFields, setFieldError],
  )

  const validateForm = useCallback(async (): Promise<boolean> => {
    const newTouched: Record<string, boolean> = {}
    let allValid = true

    const allFields = new Set([
      ...requiredFields,
      ...Object.keys(fieldValidatorsRef.current),
      ...Object.keys(values)
    ])

    // Mark all fields as touched
    allFields.forEach(field => {
      newTouched[field] = true
    })
    setTouched((prev) => ({ ...prev, ...newTouched }))

    const validationPromises = Array.from(allFields).map(async (field) => {
      const validator = fieldValidatorsRef.current[field]
      if (validator) {
        try {
          const isValid = await validator()
          if (!isValid) allValid = false
          return isValid
        } catch (error) {
          console.error(`Validation error for field ${field}:`, error)
          allValid = false
          return false
        }
      } else {
        const value = values[field]
        let error = ""

        if (requiredFields.includes(field)) {
          if (value === "" || value === undefined || value === null) {
            error = "This field is required"
          } else if (typeof value === "string" && value.trim() === "") {
            error = "This field is required"
          } else if (Array.isArray(value) && value.length === 0) {
            error = "This field is required"
          } else if (typeof value === "boolean" && value === false && field === "terms") {
            error = "You must accept the terms and conditions"
          }
        }

        if (error) {
          setFieldError(field, error)
          allValid = false
          return false
        } else {
          setFieldError(field, "")
          return true
        }
      }
    })

    await Promise.all(validationPromises)

    return allValid
  }, [values, requiredFields, setFieldError])

  // ---- Reset ----
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitted(false)
    setIsSubmitting(false)
  }, [initialValues])

  // ---- Submission ----
  const submitForm = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const isValid = await validateForm()
      if (isValid && onSubmit) {
        await onSubmit(values)
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, onSubmit, values])

  const handleSubmit = useCallback(
    (onSubmitCallback: (values: FormValues) => void | Promise<void>) => 
      async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Validation is handled by the Button component
        // This just calls the onSubmit callback after validation passed
        try {
          await onSubmitCallback(values)
          setIsSubmitted(true)
          
          // Call success callback if registered (this triggers the success modal)
          if (onSubmitSuccessRef.current) {
            onSubmitSuccessRef.current()
          }
        } catch (error) {
          console.error("Form submission error:", error)
          // Call success callback even on error to stop loading state
          if (onSubmitSuccessRef.current) {
            onSubmitSuccessRef.current()
          }
          throw error
        }
      },
    [values],
  )

  // ---- Context Value ----
  const value: FormContextType = {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    submitForm,
    handleSubmit,
    registerField,
    unregisterField,
    onSubmitSuccess: undefined, // Will be set by Button component
  }

  // Allow Button to set success callback
  Object.defineProperty(value, 'onSubmitSuccess', {
    get: () => onSubmitSuccessRef.current,
    set: (callback) => {
      onSubmitSuccessRef.current = callback
    },
    enumerable: true,
    configurable: true,
  })

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider")
  }
  return context
}