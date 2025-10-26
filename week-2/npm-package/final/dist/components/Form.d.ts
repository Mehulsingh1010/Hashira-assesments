import type React from "react";
import type { FormValues } from "../types";
import type { ThemeConfig } from "../types";
export interface FormProps {
    children: React.ReactNode;
    onSubmit: (values: FormValues) => Promise<void> | void;
    initialValues?: FormValues;
    theme?: Partial<ThemeConfig>;
    className?: string;
    style?: React.CSSProperties;
    /** Define which fields are required for validation */
    requiredFields?: string[];
}
export declare const Form: React.FC<FormProps>;
//# sourceMappingURL=Form.d.ts.map