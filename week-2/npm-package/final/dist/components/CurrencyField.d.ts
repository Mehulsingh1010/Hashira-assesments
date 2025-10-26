import React from "react";
export interface CurrencyFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    currency?: string;
    min?: number;
    max?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange?: (value: number | null) => void;
    onBlur?: () => void;
    className?: string;
    helperText?: string;
}
export declare const CurrencyField: React.FC<CurrencyFieldProps>;
//# sourceMappingURL=CurrencyField.d.ts.map