import type React from "react";
import { type ValidationConfig } from "../utils/validators";
import type { ThemeConfig } from "../types";
export interface TextFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel" | "url" | "number";
    validation?: ValidationConfig;
    theme?: Partial<ThemeConfig>;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    value?: string;
    helperText?: string;
    showError?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    containerClassName?: string;
}
export declare const TextField: React.FC<TextFieldProps>;
//# sourceMappingURL=TextField.d.ts.map