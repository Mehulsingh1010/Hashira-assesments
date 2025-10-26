import type React from "react";
import type { ThemeConfig } from "../types";
export interface DateFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    min?: string;
    max?: string;
    minAge?: number;
    maxAge?: number;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    inputClassName?: string;
    helperText?: string;
    theme?: Partial<ThemeConfig>;
}
export declare const DateField: React.FC<DateFieldProps>;
//# sourceMappingURL=DateField.d.ts.map