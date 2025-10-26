/**
 * Custom hook to access form context
 * Provides access to form state and methods
 */
export declare const useForm: () => {
    values: import("..").FormValues;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    setFieldValue: (field: string, value: any) => void;
    setFieldError: (field: string, error: string) => void;
    setFieldTouched: (field: string, isTouched: boolean) => void;
    resetForm: () => void;
    handleSubmit: (onSubmitCallback: (values: import("..").FormValues) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>;
};
//# sourceMappingURL=useForm.d.ts.map