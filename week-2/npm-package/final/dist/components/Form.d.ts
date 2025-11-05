import type React from "react";
import type { FormValues } from "../types";
import "../styles/globals.css";
export interface FormProps {
    children: React.ReactNode;
    onSubmit: (values: FormValues) => Promise<void> | void;
    initialValues?: FormValues;
    className?: string;
    containerClassName?: string;
    /** Define which fields are required for validation */
    requiredFields?: string[];
}
export declare const Form: React.FC<FormProps>;
//# sourceMappingURL=Form.d.ts.map