import React from "react";
import "../styles/globals.css";
export interface FormGroupProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    spacing?: "compact" | "normal" | "relaxed";
    highlight?: boolean;
    className?: string;
    containerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}
export declare const FormGroup: React.FC<FormGroupProps>;
//# sourceMappingURL=FormGroup.d.ts.map