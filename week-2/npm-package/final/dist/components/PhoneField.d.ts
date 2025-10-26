import React from "react";
import type { ThemeConfig } from "../types";
export interface PhoneFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    countryCode?: string;
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
export declare const PhoneField: React.FC<PhoneFieldProps>;
//# sourceMappingURL=PhoneField.d.ts.map