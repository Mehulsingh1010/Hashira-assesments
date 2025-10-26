import type React from "react";
import { type ValidationConfig } from "../utils/validators";
import type { ThemeConfig } from "../types";
export interface TextareaProps {
    name: string;
    label?: string;
    placeholder?: string;
    validation?: ValidationConfig;
    theme?: Partial<ThemeConfig>;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    value?: string;
    rows?: number;
    maxLength?: number;
    showCharCount?: boolean;
}
export declare const Textarea: React.FC<TextareaProps>;
//# sourceMappingURL=Textarea.d.ts.map