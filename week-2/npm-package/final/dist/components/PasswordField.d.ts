import React from "react";
import "../styles/globals.css";
export interface PasswordFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    minStrength?: "weak" | "fair" | "good" | "strong" | "very-strong";
    showStrengthMeter?: boolean;
    matchField?: string;
    onChange?: (value: string) => void;
    onValidation?: (isValid: boolean, error?: string) => void;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    inputClassName?: string;
    helperText?: string;
}
export declare const PasswordField: React.FC<PasswordFieldProps>;
//# sourceMappingURL=PasswordField.d.ts.map