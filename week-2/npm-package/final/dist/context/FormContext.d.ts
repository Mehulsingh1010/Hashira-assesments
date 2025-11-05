import React from "react";
import type { FormContextType, FormValues } from "../types";
export interface FormProviderProps {
    children: React.ReactNode;
    onSubmit?: (values: FormValues) => Promise<void> | void;
    initialValues?: FormValues;
    requiredFields?: string[];
}
export declare const FormProvider: React.FC<FormProviderProps>;
export declare const useFormContext: () => FormContextType;
//# sourceMappingURL=FormContext.d.ts.map