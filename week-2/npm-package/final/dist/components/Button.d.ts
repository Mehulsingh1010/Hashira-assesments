import React from "react";
import type { ThemeConfig } from "../types";
export interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
    theme?: Partial<ThemeConfig>;
    fullWidth?: boolean;
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
    enableThrottle?: boolean;
    throttleDelay?: number;
    showErrorSummary?: boolean;
    showSuccessModal?: boolean;
    successMessage?: string;
    onSuccess?: () => void;
    submissionDelay?: number;
}
export declare const Button: React.FC<ButtonProps>;
//# sourceMappingURL=Button.d.ts.map