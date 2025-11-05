import React from "react";
import "../styles/globals.css";
export interface CheckboxProps {
    name: string;
    label?: string;
    value?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}
export declare const Checkbox: React.FC<CheckboxProps>;
//# sourceMappingURL=Checkbox.d.ts.map