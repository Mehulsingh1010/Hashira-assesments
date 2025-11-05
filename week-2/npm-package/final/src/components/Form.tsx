"use client"

import type React from "react"
import { FormProvider } from "../context/FormContext"
import { useFormContext } from "../context/FormContext"
import type { FormValues } from "../types"
import "../styles/globals.css"

export interface FormProps {
  children: React.ReactNode
  onSubmit: (values: FormValues) => Promise<void> | void
  initialValues?: FormValues
  className?: string
  containerClassName?: string
  /** Define which fields are required for validation */
  requiredFields?: string[]
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  initialValues = {},
  className = "",
  containerClassName = "",
  requiredFields = [],
}) => {
  return (
    <FormProvider 
      onSubmit={onSubmit} 
      initialValues={initialValues}
      requiredFields={requiredFields}
    >
      <FormContent 
        className={className}
        containerClassName={containerClassName}
        onSubmit={onSubmit}
      >
        {children}
      </FormContent>
    </FormProvider>
  )
}

function FormContent({
  children,
  className,
  containerClassName,
  onSubmit,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  onSubmit: (values: FormValues) => Promise<void> | void
}) {
  const { handleSubmit } = useFormContext()

  const formClasses = `
    form-container
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={containerClassName}>
      <form 
        className={formClasses}
        onSubmit={handleSubmit(onSubmit)}
        noValidate // Disable browser validation to use custom validation
      >
        {children}
      </form>
    </div>
  )
}