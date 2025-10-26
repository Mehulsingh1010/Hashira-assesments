import type React from "react";
import { defaultTheme } from "../styles/theme";
export interface SearchFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    minChars?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onBlur?: () => void;
    theme?: typeof defaultTheme;
    className?: string;
    helperText?: string;
}
export declare const SearchField: React.FC<SearchFieldProps>;
//# sourceMappingURL=SearchField.d.ts.map