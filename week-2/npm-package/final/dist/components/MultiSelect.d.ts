import type React from "react";
import "../styles/globals.css";
export interface Option {
    value: string | number;
    label: string;
}
export interface MultiSelectProps {
    name: string;
    label?: string;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    maxSelection?: number;
}
export declare const MultiSelect: React.FC<MultiSelectProps>;
//# sourceMappingURL=MultiSelect.d.ts.map