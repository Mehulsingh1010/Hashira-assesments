import type React from "react";
import type { ThemeConfig } from "../types";
export interface AutocompleteOption {
    value: string | number;
    label: string;
}
export interface AutocompleteProps {
    name: string;
    label?: string;
    options: AutocompleteOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    theme?: Partial<ThemeConfig>;
    className?: string;
    style?: React.CSSProperties;
    multiple?: boolean;
    freeSolo?: boolean;
    maxSelection?: number;
}
export declare const Autocomplete: React.FC<AutocompleteProps>;
//# sourceMappingURL=Autocomplete.d.ts.map