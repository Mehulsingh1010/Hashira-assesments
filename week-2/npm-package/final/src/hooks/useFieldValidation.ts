"use client"
import { useCallback, useMemo } from "react"
import { validate, type ValidationConfig, type ValidationResult } from "../utils/validators"
import { debounce } from "../utils/debounce"
import { useFormContext } from "../context/FormContext"


export const useFieldValidation = (fieldName?: string, config?: ValidationConfig) => {
  const formContext = useFormContext()
  const name = fieldName || "field"

  const debouncedValidate = useMemo(
    () =>
      debounce((value: string, callback: (result: ValidationResult) => void): void => {
        if (!config) {
          callback({ isValid: true })
          return
        }
        const result = validate(value, config)
        callback(result)
      }, 300),
    [config],
  )

  const validateField = useCallback(
    (value: string) => {
      // Perform immediate synchronous validation for instant feedback
      if (!config) {
        formContext.setFieldError(name, "")
        return { isValid: true }
      }

      const immediateResult = validate(value, config)
      
      // Set the error immediately
      if (!immediateResult.isValid) {
        formContext.setFieldError(name, immediateResult.error || "Validation failed")
      } else {
        formContext.setFieldError(name, "")
      }

      debouncedValidate(value, (debouncedResult) => {
        if (!debouncedResult.isValid) {
          formContext.setFieldError(name, debouncedResult.error || "Validation failed")
        } else {
          formContext.setFieldError(name, "")
        }
      })

      return immediateResult
    },
    [name, formContext, debouncedValidate, config],
  )

  return {
    validateField,
    error: formContext.errors[name],
    isTouched: formContext.touched[name],
  }
}