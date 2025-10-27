import { type ValidationConfig, type ValidationResult } from "../utils/validators";
export declare const useFieldValidation: (fieldName?: string, config?: ValidationConfig) => {
    validateField: (value: string) => ValidationResult;
    error: string;
    isTouched: boolean;
};
//# sourceMappingURL=useFieldValidation.d.ts.map