import React from "react";
import "../styles/globals.css";
export interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    size?: "small" | "medium" | "large";
    enableThrottle?: boolean;
    throttleDelay?: number;
    showErrorSummary?: boolean;
    showSuccessModal?: boolean;
    successMessage?: string;
    onSuccess?: () => void;
    submissionDelay?: number;
    className?: string;
    containerClassName?: string;
}
export declare const Button: React.FC<ButtonProps>;
//# sourceMappingURL=Button.d.ts.map