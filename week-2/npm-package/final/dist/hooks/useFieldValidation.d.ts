import { type ValidationConfig, type ValidationResult } from "../utils/validators";
/**
 * Custom hook for field-level validation with debouncing
 * Made fieldName optional with default value
 */
export declare const useFieldValidation: (fieldName?: string, config?: ValidationConfig) => {
    validateField: (value: string) => ValidationResult;
    error: string;
    isTouched: boolean;
};
//# sourceMappingURL=useFieldValidation.d.ts.map