import { useFormContext } from "../context/FormContext"


//  Custom hook to access form context
//  Provides access to form state and methods

export const useForm = () => {
  const context = useFormContext()

  return {
    values: context.values,
    errors: context.errors,
    touched: context.touched,
    isSubmitting: context.isSubmitting,
    setFieldValue: context.setFieldValue,
    setFieldError: context.setFieldError,
    setFieldTouched: context.setFieldTouched,
    resetForm: context.resetForm,
    handleSubmit: context.handleSubmit,
  }
}
