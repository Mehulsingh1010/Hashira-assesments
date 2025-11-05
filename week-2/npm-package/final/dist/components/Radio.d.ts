import React from "react";
import "../styles/globals.css";
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
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
}
export declare const Radio: React.FC<RadioProps>;
//# sourceMappingURL=Radio.d.ts.map