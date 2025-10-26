import React from "react";
import type { ThemeConfig } from "../types";
export interface CheckboxProps {
    name: string;
    label?: string;
    value?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    theme?: Partial<ThemeConfig>;
    required?: boolean;
}
export declare const Checkbox: React.FC<CheckboxProps>;
//# sourceMappingURL=Checkbox.d.ts.map