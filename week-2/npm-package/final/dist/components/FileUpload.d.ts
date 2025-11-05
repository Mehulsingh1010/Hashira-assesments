import type React from "react";
import "../styles/globals.css";
export interface FileUploadProps {
    name: string;
    label?: string;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    showPreview?: boolean;
}
export declare const FileUpload: React.FC<FileUploadProps>;
//# sourceMappingURL=FileUpload.d.ts.map