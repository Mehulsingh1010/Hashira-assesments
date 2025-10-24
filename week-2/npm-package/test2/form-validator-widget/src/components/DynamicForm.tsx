import React, { useEffect } from "react";
import { useDynamicForm, type FieldValidation } from "../hooks/useDynamicForm";
import { polyfills } from "../utils/polyfills";

export interface FieldDef {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  validators?: ("email" | "minLength" | "maxLength")[];
  minLength?: number;
  maxLength?: number;
}

interface DynamicFormProps {
  fields: FieldDef[];
  initialValues?: Record<string, string>;
  validations?: FieldValidation;
  onSubmit: (values: Record<string, string>) => void;
  className?: string;
  inputClass?: string;
  errorClass?: string;
  buttonClass?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues,
  validations,
  onSubmit,
  className,
  inputClass,
  errorClass,
  buttonClass
}) => {
  useEffect(() => polyfills(), []);

  const autoInitialValues: Record<string, string> = initialValues || {};
  const autoValidations: FieldValidation = validations || {};

  fields.forEach(field => {
    if (!(field.name in autoInitialValues)) autoInitialValues[field.name] = "";

    if (!(field.name in autoValidations)) {
      const fieldValidators = [];
      if (field.required) fieldValidators.push((v: string) => v.trim() ? null : `${field.placeholder} is required`);
      if (field.validators?.includes("email")) fieldValidators.push((v: string) => /^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email");
      if (field.validators?.includes("minLength") && field.minLength)
        fieldValidators.push((v: string) => v.length >= field.minLength! ? null : `${field.placeholder} must be at least ${field.minLength} chars`);
      if (field.validators?.includes("maxLength") && field.maxLength)
        fieldValidators.push((v: string) => v.length <= field.maxLength! ? null : `${field.placeholder} max ${field.maxLength} chars`);
      autoValidations[field.name] = fieldValidators;
    }
  });

  const { values, errors, handleChange, handleSubmit } = useDynamicForm(autoInitialValues, autoValidations);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {fields.map(field => (
        <div key={field.name} className="mb-4 relative">
          <input
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={handleChange(field.name)}
            className={`${inputClass} border p-3 rounded focus:ring-2 focus:ring-blue-400 transition-all duration-300 w-full`}
          />
          {errors[field.name] && (
            <span className={`${errorClass} text-red-500 text-sm absolute top-full left-0 mt-1`}>
              {errors[field.name]}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className={`${buttonClass} bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-all duration-300 w-full`}
      >
        Submit
      </button>
    </form>
  );
};
