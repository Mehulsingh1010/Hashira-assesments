/**
 * Comprehensive validation functions for various field types
 */
export type ValidationRule = "email" | "phone" | "name" | "password" | "url" | "number" | "alphanumeric" | "custom";
export interface ValidationConfig {
    type: ValidationRule;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => boolean;
    errorMessage?: string;
}
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
export declare const validateEmail: (email: string) => ValidationResult;
export declare const validatePhone: (phone: string) => ValidationResult;
export declare const validateName: (name: string) => ValidationResult;
export interface PasswordConfig {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}
export declare const validatePassword: (password: string, config?: PasswordConfig) => ValidationResult;
export declare const validateUrl: (url: string) => ValidationResult;
export declare const validateNumber: (value: string) => ValidationResult;
export declare const validateAlphanumeric: (value: string) => ValidationResult;
export declare const validateLength: (value: string, minLength?: number, maxLength?: number) => ValidationResult;
export declare const validatePasswordMatch: (password: string, confirmPassword: string) => ValidationResult;
export declare const validate: (value: string, config: ValidationConfig) => ValidationResult;
//# sourceMappingURL=validators.d.ts.map