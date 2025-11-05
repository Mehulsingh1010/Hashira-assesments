import React from "react";
import "../styles/globals.css";
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
}
export declare const PhoneField: React.FC<PhoneFieldProps>;
//# sourceMappingURL=PhoneField.d.ts.map