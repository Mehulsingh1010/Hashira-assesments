import type React from "react";
import type { ThemeConfig } from "../types";
export interface FileUploadProps {
    name: string;
    label?: string;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    theme?: Partial<ThemeConfig>;
    className?: string;
    style?: React.CSSProperties;
    showPreview?: boolean;
}
export declare const FileUpload: React.FC<FileUploadProps>;
//# sourceMappingURL=FileUpload.d.ts.map