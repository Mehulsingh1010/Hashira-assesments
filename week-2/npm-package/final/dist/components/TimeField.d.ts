import type React from "react";
export interface TimeFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    helperText?: string;
}
export declare const TimeField: React.FC<TimeFieldProps>;
//# sourceMappingURL=TimeField.d.ts.map