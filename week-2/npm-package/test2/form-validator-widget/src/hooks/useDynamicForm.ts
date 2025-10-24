import { useState, useCallback } from "react";
import { debounce } from "../utils/debounce";
import { throttle } from "../utils/throttle";

export type ValidatorFn = (value: string) => string | null;

export interface FieldValidation {
  [field: string]: ValidatorFn[];
}

export const useDynamicForm = (initialValues: Record<string, string>, validations: FieldValidation) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateField = useCallback(
    (name: string, value: string) => {
      const validators = validations[name] || [];
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return null;
    },
    [validations]
  );

  const throttledValidate = throttle(
    debounce((name: string, value: string) => {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }, 200),
    300
  );

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    throttledValidate(name, value);
  };

  const handleSubmit = (callback: (values: Record<string, string>) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string | null> = {};
    Object.keys(validations).forEach(field => {
      newErrors[field] = validateField(field, values[field]);
    });
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) callback(values);
  };

  return { values, errors, handleChange, handleSubmit };
};
