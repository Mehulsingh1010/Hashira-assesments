import type React from "react";
export interface NumberFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (value: number | null) => void;
    onBlur?: () => void;
    className?: string;
    helperText?: string;
}
export declare const NumberField: React.FC<NumberFieldProps>;
//# sourceMappingURL=NumberField.d.ts.map