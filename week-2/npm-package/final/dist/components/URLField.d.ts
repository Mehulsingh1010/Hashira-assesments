import type React from "react";
import { defaultTheme } from "../styles/theme";
export interface URLFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    theme?: typeof defaultTheme;
    className?: string;
    helperText?: string;
}
export declare const URLField: React.FC<URLFieldProps>;
//# sourceMappingURL=URLField.d.ts.map