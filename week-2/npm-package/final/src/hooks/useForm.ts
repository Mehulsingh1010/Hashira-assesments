import { useFormContext } from "../context/FormContext"

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
