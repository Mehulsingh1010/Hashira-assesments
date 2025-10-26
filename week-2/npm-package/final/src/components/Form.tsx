"use client"

import type React from "react"
import { FormProvider } from "../context/FormContext"
import { useFormContext } from "../context/FormContext"
import type { FormValues } from "../types"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface FormProps {
  children: React.ReactNode
  onSubmit: (values: FormValues) => Promise<void> | void
  initialValues?: FormValues
  theme?: Partial<ThemeConfig>
  className?: string
  style?: React.CSSProperties
  /** Define which fields are required for validation */
  requiredFields?: string[]
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  initialValues = {},
  theme: customTheme,
  className,
  style,
  requiredFields = [],
}) => {
  const theme = { ...defaultTheme, ...customTheme }

  const formStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing,
    ...style,
  }

  return (
    <FormProvider 
      onSubmit={onSubmit} 
      initialValues={initialValues}
      requiredFields={requiredFields}
    >
      <FormContent 
        formStyles={formStyles} 
        className={className}
        onSubmit={onSubmit}
      >
        {children}
      </FormContent>
    </FormProvider>
  )
}

function FormContent({
  children,
  formStyles,
  className,
  onSubmit,
}: {
  children: React.ReactNode
  formStyles: React.CSSProperties
  className?: string
  onSubmit: (values: FormValues) => Promise<void> | void
}) {
  const { handleSubmit } = useFormContext()

  return (
    <form 
      style={formStyles} 
      className={className} 
      onSubmit={handleSubmit(onSubmit)}
      noValidate // Disable browser validation to use custom validation
    >
      {children}
    </form>
  )
}