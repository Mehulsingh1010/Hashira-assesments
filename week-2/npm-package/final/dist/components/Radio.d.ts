import React from "react";
import type { ThemeConfig } from "../types";
export interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}
export interface RadioProps {
    name: string;
    options: RadioOption[];
    label?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    direction?: "horizontal" | "vertical";
    helperText?: string;
    theme?: Partial<ThemeConfig>;
}
export declare const Radio: React.FC<RadioProps>;
//# sourceMappingURL=Radio.d.ts.map