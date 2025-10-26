import React from "react";
import type { ThemeConfig } from "../types";
export interface OtpInputProps {
    name: string;
    length?: number;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    onComplete?: (otp: string) => void;
    theme?: Partial<ThemeConfig>;
    helperText?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const OtpInput: React.FC<OtpInputProps>;
//# sourceMappingURL=OtpInput.d.ts.map