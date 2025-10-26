import React from "react";
import type { ThemeConfig } from "../types";
export interface FormGroupProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    theme?: Partial<ThemeConfig>;
    spacing?: "compact" | "normal" | "relaxed";
    highlight?: boolean;
}
export declare const FormGroup: React.FC<FormGroupProps>;
//# sourceMappingURL=FormGroup.d.ts.map