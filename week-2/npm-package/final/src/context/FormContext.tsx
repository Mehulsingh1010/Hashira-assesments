"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import type { FormContextType, FormValues } from "../types"

const FormContext = createContext<FormContextType | undefined>(undefined)

export interface FormProviderProps {
  children: React.ReactNode
  onSubmit?: (values: FormValues) => Promise<void> | void
  initialValues?: FormValues
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
    setValues(prev => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => {
      if (!error) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return { ...prev, [field]: error }
    })
  }, [])

  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
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
      if (validator) return await validator()

      const value = values[field]
      let error = ""

      if (requiredFields.includes(field)) {
        if (value === "" || value == null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
          error = "This field is required"
        } else if (field === "terms" && value === false) {
          error = "You must accept the terms and conditions"
        }
      }

      setFieldError(field, error)
      return !error
    },
    [values, requiredFields, setFieldError]
  )

  const validateForm = useCallback(async (): Promise<boolean> => {
    const allFields = new Set([...requiredFields, ...Object.keys(fieldValidatorsRef.current), ...Object.keys(values)])
    const newTouched: Record<string, boolean> = {}
    allFields.forEach(f => newTouched[f] = true)
    setTouched(prev => ({ ...prev, ...newTouched }))

    let allValid = true
    await Promise.all(Array.from(allFields).map(async field => {
      const valid = await validateField(field)
      if (!valid) allValid = false
    }))
    return allValid
  }, [values, requiredFields, validateField])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitted(false)
    setIsSubmitting(false)
  }, [initialValues])

  const submitForm = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const isValid = await validateForm()
      if (isValid && onSubmit) {
        await onSubmit(values)
        setIsSubmitted(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, onSubmit, values])

  const handleSubmit = useCallback(
    (callback: (values: FormValues) => void | Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
          await callback(values)
          setIsSubmitted(true)
          onSubmitSuccessRef.current?.()
        } catch (err) {
          console.error(err)
          onSubmitSuccessRef.current?.()
          throw err
        }
      },
    [values]
  )

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
    get onSubmitSuccess() { return onSubmitSuccessRef.current },
    set onSubmitSuccess(callback) { onSubmitSuccessRef.current = callback }
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext)
  if (!context) throw new Error("useFormContext must be used within FormProvider")
  return context
}
