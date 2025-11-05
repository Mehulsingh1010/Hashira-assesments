import type React from "react";
import "../styles/globals.css";
export interface SelectOption {
    label: string;
    value: string;
}
export interface SelectProps {
    name: string;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    value?: string;
    helperText?: string;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    inputClassName?: string;
}
export declare const Select: React.FC<SelectProps>;
//# sourceMappingURL=Select.d.ts.map